import axios from "axios";
import { IProduct } from "../../../../../../Shared/types";

export function ProductsFilter(
  setdata: React.Dispatch<React.SetStateAction<IProduct[]>>,
  setIsBtnSubmitDisabeld: React.Dispatch<React.SetStateAction<Boolean>>,
  setIsLoading: React.Dispatch<React.SetStateAction<Boolean>>
) {
  const form = document.querySelector<HTMLFormElement>(
    ".products__filter__form"
  );
  const inputTitle = document.querySelector<HTMLInputElement>(
    ".products__filter__title--innTitle_product"
  );
  const inputPriceFrom = document.querySelector<HTMLInputElement>(
    ".products__filter__price--innPrice_productFrom"
  );
  const inputPriceTo = document.querySelector<HTMLInputElement>(
    ".products__filter__price--innPrice_productTo"
  );
  const btnFormReset = document.querySelector<HTMLButtonElement>(
    ".products__filter--submit--reset"
  );
  const btnFormSubmit = document.querySelector<HTMLButtonElement>(
    ".products__filter--submit"
  );

  form?.addEventListener("input", () => {
    if (
      inputTitle?.value !== "" ||
      inputPriceFrom?.value !== "" ||
      inputPriceTo?.value !== ""
    ) {
      setIsBtnSubmitDisabeld(false);
    } else {
      setIsBtnSubmitDisabeld(true);
    }
  });

  form?.addEventListener("submit", async (event) => {
    event?.preventDefault();
  });

  btnFormSubmit?.addEventListener("click", async () => {
    const filter = {
      title: inputTitle?.value,
      priceFrom: inputPriceFrom?.value,
      priceTo: inputPriceTo?.value,
    };

    setIsLoading(true);

    try {
      const response = await axios.get<IProduct[]>(
        `http://localhost:3000/api/products/search`,
        { params: filter }
      );
      setdata(response.data);
    } catch (e) {
      console.log(e);
      setdata([]);
    } finally {
      setIsLoading(false);
    }
  });

  btnFormReset?.addEventListener("click", async () => {
    form?.reset();

    setIsLoading(true);

    try {
      const response = await axios.get<IProduct[]>(
        "http://localhost:3000/api/products"
      );
      setdata(response.data);
    } catch (e) {
      console.log(e);
      setdata([]);
    } finally {
      setIsLoading(false);
    }

    setIsBtnSubmitDisabeld(true);
  });
}
