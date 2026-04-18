import axios from "axios";

export type GoogleUser = {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string
}

export const GoogleAuth = {

    async userInfo(access_token: string) {
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return data as {
            id: string;
            email: string;
            verified_email: boolean;
            name: string;
            given_name: string;
            family_name: string;
            picture: string;
            locale: string
        };
    },

    async exchangeCodeForToken(used_redirect_uri: string, code: string) {
        const { data } = await axios.post(`https://oauth2.googleapis.com/token`, {
            client_id: process.env.GOOGLE_AUTH_CLIENT_ID,
            client_secret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
            redirect_uri: used_redirect_uri,
            grant_type: 'authorization_code',
            code: code,
        }).catch((err) => {
            return { data: undefined }
        });

        return data as { access_token: string, };
    }

}