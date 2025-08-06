import { Button } from "@/components/ui/button";
import { getAllLinkForUser, getPreviewData } from "@/modules/links/actions";
import LinkForm from "@/modules/links/components/link-form";
import PreviewFrame from "@/modules/links/components/preview-frame";
import ShareMenu from "@/modules/links/components/share-menu";
import { getCurrentUsername } from "@/modules/profile/actions";
import { Brush, Share } from "lucide-react";

const Page = async () => {
  const profile = await getCurrentUsername();
  const links = await getAllLinkForUser();
  const previewData = await getPreviewData();

  return (
    <section className="flex flex-col gap-6 px-4 py-6 ">
      {/* Page header */}
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-row justify-center items-center gap-3">
          <Button
            variant="outline"
            size="default"
            className="gap-2 bg-transparent"
          >
            <Brush size={16} />
            Design
          </Button>
          <ShareMenu link={profile?.username!} />
        </div>
      </div>

      {/* Main Content - Form and Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start py-14">
        <div className="order-2 lg:order-1 border-r">
          <LinkForm
            username={profile?.username!}
            bio={profile?.bio!}
            // @ts-ignore
            link={links.data!}
            socialLinks={profile?.socialLinks!}
          />
        </div>
        <div className="order-1 lg:order-2 lg:sticky lg:top-6">
          <PreviewFrame
            links={previewData.data.map((link: any) => ({
              ...link,
              description:
                link.description === null ? undefined : link.description,
            }))}
          />
        </div>
      </div>
    </section>
  );
};

export default Page;
