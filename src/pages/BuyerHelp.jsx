import React from 'react';
import { HelpCircle, FileText, GitMerge, MessageSquare, Award, Package, Phone } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';

export default function BuyerHelp() {
  const supportTopics = [
    {
      title: 'How to create a bulk requirement',
      icon: <FileText size={20} className="text-[#1B4332]" />,
      content: 'Navigate to "Requirements" from the sidebar and click "Create Bulk Requirement". Specify the crop, grade, required quantity, and indicative price. Once submitted, DEMETER will instantly begin matching it against aggregated farmer supply.',
    },
    {
      title: 'How matching works',
      icon: <GitMerge size={20} className="text-[#1B4332]" />,
      content: 'Our algorithm aggregates supply from multiple Farmer Producer Organizations (FPOs) to meet your high-volume needs. You can view progress under the "Matching" tab. When a requirement reaches 100% matched volume, it is ready for your review and confirmation.',
    },
    {
      title: 'How negotiation works',
      icon: <MessageSquare size={20} className="text-[#1B4332]" />,
      content: 'If the indicative price does not match farmer expectations, you can negotiate directly on the platform. Go to the active match and propose a new price or review counter-offers from the farmers.',
    },
    {
      title: 'How quality reports work',
      icon: <Award size={20} className="text-[#1B4332]" />,
      content: 'Farmers upload photos of their harvest which are AI-assessed for preliminary quality. Before final procurement, physical inspection results will be uploaded and verified in the "Quality Reports" section. You can download and review these reports for every batch.',
    },
    {
      title: 'How aggregation & procurement works',
      icon: <Package size={20} className="text-[#1B4332]" />,
      content: 'Once terms are agreed upon, DEMETER plans logistics. Small batches from various farmers are aggregated at central collection points and then shipped to your delivery location. You can track this under "Orders / Procurement".',
    },
  ];

  return (
    <DashboardLayout role="buyer">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="text-[#1B4332]" size={28} />
          <h1 className="text-2xl font-bold text-[#1C1C1E]">Buyer Support & Guides</h1>
        </div>
        <p className="text-sm text-[#6B7280]">Learn how to manage bulk requirements and procure effectively on DEMETER.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {supportTopics.map((topic, index) => (
            <Card key={index}>
              <div className="px-5 py-4 border-b border-[#E5E7E0] flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1B4332]/10 flex items-center justify-center flex-shrink-0">
                  {topic.icon}
                </div>
                <h2 className="font-bold text-[#1C1C1E]">{topic.title}</h2>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-[#374151] leading-relaxed">{topic.content}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-5">
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Contact Support</h2>
            </div>
            <div className="px-5 py-5 space-y-4 text-sm">
              <p className="text-[#6B7280]">Need help with a large order or experiencing an issue? Our enterprise support team is available 24/7.</p>
              
              <div className="flex items-center gap-3 text-[#1C1C1E]">
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="font-semibold">Toll-free Helpdesk</p>
                  <p className="text-[#1B4332] font-bold">1800-XXX-XXXX</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#1C1C1E]">
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <p className="font-semibold">Email Support</p>
                  <p className="text-[#1B4332] font-bold">buyersupport@demeter.in</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="bg-[#FAFAF7] border border-[#E5E7E0] rounded-xl p-5">
            <h3 className="font-semibold text-[#1C1C1E] mb-2">Platform Status</h3>
            <div className="flex items-center gap-2 text-sm text-[#374151]">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
