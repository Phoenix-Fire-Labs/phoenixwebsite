// trace:v1 id=impl.transcript-content work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-406ZSYBP
export interface ExtractedField {
  field: string;
  value: string;
}

/** The example transmission and the operational facts Mockingbird separates
 *  out of it. Data lives here rather than beside the component: a module that
 *  exports both a component and non-component values cannot preserve state
 *  across a Fast Refresh edit. */
export const TRANSMISSION = "Division Alpha, Engine 72 advancing north past Ridge 4…";

export const EXTRACTED_FIELDS: ExtractedField[] = [
  { field: "Unit", value: "Engine 72" },
  { field: "Action", value: "Advancing" },
  { field: "Location", value: "Ridge 4" },
  { field: "Direction", value: "North" },
];
