import React from "react";
import FormBanner from "../../static/images/hospitalBanner.png";
import { getPrintWithBanner } from "../helper/printSettings";

interface PrintBannerProps {
  width?: string;
  height?: string;
  className?: string;
}

/**
 * Hospital banner used at the top of every printable report/slip.
 * When the global "print with banner" setting is off, the image keeps its
 * space but is rendered invisible so the layout still lines up on
 * pre-printed letterhead pads.
 */
const PrintBanner: React.FC<PrintBannerProps> = ({ width, height, className }) => (
  <div className="formBanner">
    <img
      src={FormBanner}
      width={width}
      height={height}
      className={className}
      alt="Banner"
      style={getPrintWithBanner() ? undefined : { visibility: "hidden" }}
    />
  </div>
);

export default PrintBanner;
