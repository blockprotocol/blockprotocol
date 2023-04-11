import { IconPathData } from "@fortawesome/fontawesome-svg-core";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, FunctionComponent, SVGProps } from "react";

export const FontAwesomeIconPath: FunctionComponent<{
  svgPathData: IconPathData;
  fill?: string;
}> = ({ svgPathData, fill }) => {
  return typeof svgPathData === "string" ? (
    <path d={svgPathData} style={{ ...(fill ? { fill } : {}) }} />
  ) : (
    <>
      {
        /**
         * A multi-path Font Awesome icon seems to imply a duotune icon. The 0th path seems to
         * be the faded element (referred to as the "secondary" path in the Font Awesome docs)
         * of a duotone icon. 40% is the default opacity.
         *
         * @see https://fontawesome.com/how-to-use/on-the-web/styling/duotone-icons#changing-opacity
         */
        svgPathData.map((pathData: string, i: number) => (
          <path
            key={pathData}
            style={{ ...(fill ? { fill } : {}), opacity: i === 0 ? 0.4 : 1 }}
            d={pathData}
          />
        ))
      }
    </>
  );
};
export type FontAwesomeIconProps = {
  icon: IconDefinition;
} & SVGProps<SVGSVGElement>;

// gotten from https://mui.com/components/icons/#font-awesome
export const FontAwesomeIcon = forwardRef<
  SVGSVGElement,
  FontAwesomeIconProps // https://github.com/prettier/prettier/issues/11923
>((props, ref) => {
  const { children, icon, ...otherProps } = props;

  const {
    icon: [width, height, , , svgPathData],
  } = icon;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      {...otherProps}
      style={{
        fill: "currentColor",
        width: "1em",
        height: "1em",
        fontSize: "15px",
        ...otherProps.style,
      }}
    >
      <FontAwesomeIconPath svgPathData={svgPathData} />

      {children}
    </svg>
  );
});
