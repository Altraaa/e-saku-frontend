import MainLayout from "@/components/layouts/MainLayout";


const Dashboard = () => {
  return (
    <MainLayout>
      <h1 className="text-3xl font-semibold">Welcome to the Dashboard!</h1>
      <p className="mt-4 text-lg">
        This is your main content area. You can add whatever you like here.
      </p>
    </MainLayout>
  );
};

export default Dashboard;
