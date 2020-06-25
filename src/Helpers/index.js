export const ownerName = (owner) => owner.type === "particulier" ? `${owner.first_name} ${owner.last_name}` : `${owner.company}`;
