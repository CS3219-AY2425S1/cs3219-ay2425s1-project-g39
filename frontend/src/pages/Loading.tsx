import { AppShell } from "@mantine/core";


function Loading() {
  return (
      <AppShell bg="slate.9">
        <AppShell.Main h="calc(100vh - 80px)" w="100%">
          <div className="loading-container">
            <div className="loading-spinner">
            </div>
          </div> 
        </AppShell.Main>
      </AppShell>
  );
}

export default Loading;