import { useEffect } from "react";
import styled from "styled-components";
import ProductItem from "./ProductItem";
import { ProductListValues } from "../../../lib/state/productItemState";
import StateMenuBar from "./StateMenuBar";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ButtonDefaultStyle from "../../../Components/Buttons/ButtonDefault";
import {
  productListState,
  SelectOption,
  Option,
  selectOptionState,
  selectProductListState
} from "../../../lib/state/productItemState";
import { useNavigate, useParams } from "react-router-dom";
import PageHeaderMessage from "../../../Components/PageHeader";
import { storeState } from "../../../lib/state/storeState";
import { useGetProductsQuery } from "../../../lib/generated/graphql";
import graphqlReqeustClient from "../../../lib/graphqlRequestClient";
import { userState } from "../../../lib/state/userState";
import Loading from "../../../Components/Loading";

import { MdAddCircle, MdDelete } from "react-icons/md";

const Container = styled.div<{ selectOption: boolean }>`
  padding-bottom: ${({ selectOption }) => (selectOption ? "12rem;" : "3rem")};
  ul.productList {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(20rem, auto);
    ${({ theme }) => theme.device.tablet} {
      grid-template-columns: repeat(2, 1fr);
    }
    ${({ theme }) => theme.device.mobile} {
      grid-template-columns: unset;
    }
  }
`;
const ManageOptionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  ${({ theme }) => theme.device.tablet} {
    flex-wrap: wrap;
  }
  ${({ theme }) => theme.device.mobile} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;
const ButtonItemWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 2.5rem;
  &:not(:first-child) {
    margin-left: 0.7rem;
  }
  button {
    color: ${({ theme }) => theme.color.fontColorBlack};
    background-color: unset;
    padding: 0;
    padding-left: 0.5rem;
  }
`;

const CreateProductButton = styled(ButtonDefaultStyle)``;
const DeleteProductButton = styled(ButtonDefaultStyle)``;

const AdminManageProductItemList = () => {
  const { storeId, userId } = useParams();
  const { accessToken } = useRecoilValue(userState);
  const navigate = useNavigate();
  const store = useRecoilValue(storeState);
  const [productList, setProductList] = useRecoilState(productListState);
  const [selectOption, setSelectOption] = useRecoilState(selectOptionState);
  const setSelectProduct = useSetRecoilState(selectProductListState);

  const { isLoading } = useGetProductsQuery(
    graphqlReqeustClient(accessToken),
    {
      id: Number(storeId)
    },
    {
      onSuccess: (data) => {
        if (data.store?.products) {
          const productList = data.store.products.map<ProductListValues>(
            (value) => ({
              id: Number(value.id),
              isAvailable: value.isAvailable,
              name: value.name,
              price: value.price,
              imageUrl: value.imageUrl,
              description: value.description,
              options: value.options.map((item) => ({
                id: Number(item.id),
                name: item.name
              }))
            })
          );

          setProductList(productList);
        }
      }
    }
  );

  const handleDeleteItem = () => {
    handleSelectOption({ options: Option.DELETE });
  };

  const handleSelectOption = (option: SelectOption) => {
    setSelectOption(option);
  };

  useEffect(() => {
    return () => {
      setSelectOption({ options: Option.NONE });
      setSelectProduct([]);
    };
  }, []);

  return isLoading ? (
    <Loading title="등록한 상품을 불러오고 있습니다." />
  ) : (
    <>
      <Container selectOption={selectOption.options !== "none"}>
        <ManageOptionContainer>
          <PageHeaderMessage header="상품 관리" message={store.name} />
          {selectOption.options === "none" && (
            <ButtonContainer>
              <ButtonItemWrapper
                onClick={() =>
                  navigate(
                    `/admin/${userId}/store/${storeId}/product/add-product`
                  )
                }
              >
                <MdAddCircle />
                <CreateProductButton>상품등록</CreateProductButton>
              </ButtonItemWrapper>
              <ButtonItemWrapper onClick={handleDeleteItem}>
                <MdDelete />
                <DeleteProductButton>상품삭제</DeleteProductButton>
              </ButtonItemWrapper>
            </ButtonContainer>
          )}
        </ManageOptionContainer>
        <ul className="productList">
          <ProductItem productData={productList} />
        </ul>
      </Container>
      {selectOption.options !== "none" && <StateMenuBar />}
    </>
  );
};

export default AdminManageProductItemList;
