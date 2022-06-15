// eslint-disable-next-line import/no-unresolved
import htmlString from "bundle-text:./app.html";

import prepareHtml from "./_parcel";

const replacedHtmlString = prepareHtml(htmlString);

export default replacedHtmlString;
