export const formatDateToISO = (dateString: any) => {
    return new Date(`${dateString}T00:00:00Z`).toISOString();
};
  