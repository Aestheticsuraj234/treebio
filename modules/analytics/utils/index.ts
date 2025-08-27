
const normalizeIP = (ip: string): string => {
  if (ip === "::1") {
    return "127.0.0.1";
  }
  
  if (ip.startsWith("::ffff:")) {
    return ip.substring(7);
  }
  
  if (ip.length > 45) {
    return ip.substring(0, 45);
  }
  
  return ip;
};

export { normalizeIP };