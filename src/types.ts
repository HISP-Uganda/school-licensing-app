export interface Attribute {
  attribute: string;
  value: string;
}

export interface TrackedEntityInstance {
  attributes: Attribute[];
  orgUnitName?: string;
}
