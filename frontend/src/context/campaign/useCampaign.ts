import { useContext } from "react";
import { CampaignContext } from "./CampaignContext";

export const useCampaign = () => {
  const context = useContext(CampaignContext);

  if (!context) {
    throw new Error(
      "useCampaign must be used inside a CampaignProvider"
    );
  }

  return context;
};