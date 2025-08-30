import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import UploadTab from './UploadTab';
import EditTab from './EditTab';
import TextTab from './TextTab';
import PricingCardDemo from './PricingCardDemo';

interface SidebarRightProps {
  onLoading: (loading: boolean, message?: string) => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ onLoading }) => {
  return (
    <aside className="w-[320px] bg-muted/50 rounded-2xl p-3 flex flex-col z-10 border border-border">
      <Tabs defaultValue="upload" className="w-full h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
        </TabsList>
        <div className="flex-grow overflow-y-auto mt-4 pr-2 -mr-2">
            <TabsContent value="upload">
                <UploadTab />
            </TabsContent>
            <TabsContent value="edit">
                <EditTab onLoading={onLoading} />
            </TabsContent>
            <TabsContent value="text">
                <TextTab />
            </TabsContent>
            <TabsContent value="upgrade">
                <div className="flex items-center justify-center">
                    <PricingCardDemo />
                </div>
            </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
};

export default SidebarRight;