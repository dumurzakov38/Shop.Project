import axios from "axios";
import { IProduct } from "../../../../../../Shared/types";
import { ICommentEntity } from "../../../../../../Shop.API/src/types";

export function product_addComment(
  setBtnSubmitDisabeld: React.Dispatch<React.SetStateAction<Boolean>>,
  id: string | undefined,
  setData: React.Dispatch<React.SetStateAction<IProduct | undefined>>,
  setLoading: React.Dispatch<React.SetStateAction<Boolean>>
) {
  const form = document.querySelector<HTMLFormElement>(
    ".product__containerAddComments__containerForm"
  );
  const innTitle = document.querySelector<HTMLInputElement>(
    ".product__containerAddComments__containerForm--title--input"
  );
  const innEmail = document.querySelector<HTMLInputElement>(
    ".product__containerAddComments__containerForm--email--input"
  );
  const textareaBody = document.querySelector<HTMLTextAreaElement>(
    ".product__containerAddComments__containerForm--body--textarea"
  );
  const btnSubmit = document.querySelector<HTMLButtonElement>(
    ".product__containerAddComments__containerForm--submit__btn"
  );

  form?.addEventListener("input", () => {
    if (
      innTitle?.value !== "" &&
      innEmail?.value !== "" &&
      textareaBody?.value !== ""
    ) {
      setBtnSubmitDisabeld(false);
    } else {
      setBtnSubmitDisabeld(true);
    }
  });

  form?.addEventListener("submit", async (event) => {
    event?.preventDefault();
  });

  btnSubmit?.addEventListener("click", (event) => {
    const data = {
      name: innTitle?.value,
      email: innEmail?.value,
      body: textareaBody?.value,
      productId: id,
    };

    const fetchData = async () => {
      try {
        await axios.post<ICommentEntity[]>(
          "http://localhost:3000/api/comments",
          {
            name: innTitle?.value,
            email: innEmail?.value,
            body: textareaBody?.value,
            productId: id,
          }
        );
      } catch (e) {
        console.log(e);
      } finally {
        const response = await axios.get<IProduct>(
          `http://localhost:3000/api/products/${id}`
        );
        setData(response.data);
        setLoading(false);
      }
    };

    fetchData();

    form?.reset();
    setBtnSubmitDisabeld(true);
  });
}
