import RootNavbar from "../components/PublicNavbar";
import PropTypes from "prop-types";

const PublicLayout = ({ children }) => (
  <>
    <RootNavbar />
    <div className="mt-20">{children}</div>
  </>
);
PublicLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicLayout;
