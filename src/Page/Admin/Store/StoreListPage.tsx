import { Loading } from "@/Components";
import { useGetStores } from "../hooks";
import { StoreList, Wrapper } from "./styles";

import { AdminStoreListHeader, StoreListItem } from "@/Components";

const StoreListPage = () => {
  const { data: stores, isLoading } = useGetStores();

  return (
    <Wrapper>
      {isLoading && <Loading title="가게 정보를 불러오고 있습니다." />}
      <AdminStoreListHeader store={stores} />
      <StoreList>
        {stores?.map((store) => (
          <StoreListItem key={store.id} store={store} />
        ))}
      </StoreList>
    </Wrapper>
  );
};

export default StoreListPage;
