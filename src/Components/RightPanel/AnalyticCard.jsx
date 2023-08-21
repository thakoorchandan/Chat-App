import * as MuiIcons from "@mui/icons-material";

export const AnalyticCard = (props) => {
  const { primaryText, secondaryText, iconName, themeColor } = props;
  const CardIcon = MuiIcons[`${iconName}`];

  return (
    <div
      style={{ backgroundColor: `${themeColor}20` }}
      className="AnalyticCardWrapper"
    >
      <div>
        <CardIcon
          sx={{
            color: themeColor,
            padding: "4px",
            backgroundColor: `${themeColor}50`,
            borderRadius: "50%",
          }}
          fontSize="small"
        />
      </div>
      <div>
        <div style={{ color: themeColor }} className="primaryAnalytic">
          {primaryText}
        </div>
        <div className="secondaryAnalytic">{secondaryText}</div>
      </div>
    </div>
  );
};
