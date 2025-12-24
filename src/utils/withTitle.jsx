import { t } from "i18next";
import { Helmet } from "react-helmet";

const withTitle = (Component, title) => {
  // props is the props of the parameter Component
  const PageTitle = props => {
    const pageTitle = title ? t("pageTitle", { title }) : t("title");

    return (
      <>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <Component {...props} />
      </>
    );
  };

  return PageTitle;
};

export default withTitle;
