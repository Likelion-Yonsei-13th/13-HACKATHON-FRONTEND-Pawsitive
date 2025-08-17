import PageLayout from "@/app/components/PageLayout";

export default function Chatbot() {
  return (
    <PageLayout pageTitle="Chatbot">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Chatbot Page</h1>
        <p className="text-gray-700">This is the chatbot page content.</p>
      </div>
    </PageLayout>
  );
}
