import Dashboard from "./Users/Dashboard";
import ERP from "./Users/ERP";

export default function LandingPage(props) {
    return <Dashboard {...props} />;
}
export function ERPPage(props) {
    return <ERP {...props} />;
}
