import { useCallback, useEffect, useState } from "react";

export function useBrowserFileReader() {
    const [file, setFile] = useState<File>();
    const [localUrl, setLocalUrl] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {

        if (file) {
            const reader = new FileReader();

            const onloadstart = (ev: ProgressEvent<FileReader>) => {
                setLoading(true);
                setProgress(0);
            };

            const onprogress = (ev: ProgressEvent<FileReader>) => {
                setProgress(Math.floor(ev.loaded / ev.total));
            };

            const onloadend = (ev: ProgressEvent<FileReader>) => {
                setLoading(false);
                setProgress(100);
                setLocalUrl(ev.target?.result as unknown as string);
            }

            reader.onloadstart = onloadstart;

            reader.onprogress = onprogress;

            reader.onloadend = onloadend;

            reader.readAsDataURL(file)

            return () => {
                reader.removeEventListener("loadstart", onloadstart);
                reader.removeEventListener("progress", onprogress);
                reader.removeEventListener("loadend", onloadend);
            }
        }

    }, [file]);

    const loadFile = useCallback((file: File) => {
        setFile(file);
    }, []);

    return {
        loadFile,
        url: localUrl,
        readProgress: progress,
        isLoading: loading
    }
}

export function useFileURL() {
    const [file, setFile] = useState<File>();
    const [localUrl, setLocalUrl] = useState<string>();

    useEffect(() => {
        return () => {
            if(localUrl) {
                URL.revokeObjectURL(localUrl);
            }
        }
    }, [localUrl]);

    const loadFile = useCallback((file: File) => {
        setFile(file);
        const url = URL.createObjectURL(file);
        console.log("Next url: ",url);
        setLocalUrl(url);
    }, []);

    return {
        file,
        url: localUrl,
        load: loadFile
    }
}