import { RequestInfo } from 'rwsdk/worker';
import CreateCollectionPageContent from './content';

export default function CreateCollectionPage(props: RequestInfo) {
  let url = new URL(props.request.url);
  let prefill = url.searchParams.get("prefill");

  return <>
    <title>Create a new collection</title>
    <meta name="description" content="Create a description of your content" />
    <CreateCollectionPageContent
      prefillLink={prefill || undefined} />
  </>
}
