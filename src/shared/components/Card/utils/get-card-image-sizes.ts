const getCardImageSizes = (display: "preview" | "full" | "cart") => {
  switch (display) {
    case "preview":
      return "(max-width: 768px) 100vw, 600px";

    case "full":
      return "(max-width: 768px) 100vw, (max-width: 1024px) 350px, 600px";

    case "cart":
      return "(max-width: 375px) 100px, (max-width: 768px) 150px, 250px";
    
    default:
      return "100vw";
  }
};

export default getCardImageSizes;