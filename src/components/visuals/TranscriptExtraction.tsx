import { EXTRACTED_FIELDS, TRANSMISSION } from "@/content/transcript";

/** One transmission with the operational facts Mockingbird separates out of it.
 *
 *  Shared because the homepage and the Mockingbird page showed the same example
 *  and each kept its own copy of the field list, so the two could drift into
 *  claiming different things about the same call. */
// trace:v1 id=impl.visual-transcript-figure work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-406ZSYBP
export function TranscriptExtraction() {
  return (
    <figure className="transcript">
      <figcaption className="transcript-caption">Tactical VHF</figcaption>
      <blockquote className="transcript-quote">&ldquo;{TRANSMISSION}&rdquo;</blockquote>
      <dl className="extract-grid">
        {EXTRACTED_FIELDS.map((item) => (
          <div key={item.field}>
            <dt>{item.field}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
