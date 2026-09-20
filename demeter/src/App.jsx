import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import FarmerDashboard from './pages/FarmerDashboard';
import AddProduce from './pages/AddProduce';
import BuyerDashboard from './pages/BuyerDashboard';
import CreateRequirement from './pages/CreateRequirement';
import OrderMatching from './pages/OrderMatching';
import NegotiationPage from './pages/NegotiationPage';
import QualityAssessment from './pages/QualityAssessment';
import Aggregation from './pages/Aggregation';
import Logistics from './pages/Logistics';
import DemandForecasting from './pages/DemandForecasting';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />

        {/* Farmer Portal */}
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/farmer/add-produce" element={<AddProduce />} />

        {/* Buyer Portal */}
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/buyer/create-requirement" element={<CreateRequirement />} />

        {/* Shared operational pages */}
        <Route path="/matching" element={<OrderMatching />} />
        <Route path="/negotiation" element={<NegotiationPage />} />
        <Route path="/quality" element={<QualityAssessment />} />
        <Route path="/aggregation" element={<Aggregation />} />
        <Route path="/logistics" element={<Logistics />} />
        <Route path="/forecasting" element={<DemandForecasting />} />
      </Routes>
    </BrowserRouter>
  );
}
