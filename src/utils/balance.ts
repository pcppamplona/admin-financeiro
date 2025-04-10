export function verifyValue(value: any): number {
    if (value == null || value === '') return 0;
    return typeof value === "number" ? value : parseFloat(value);
  }
  
  export function formattedBrAmount(value: any): string {
    const parsed = verifyValue(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parsed);
  }