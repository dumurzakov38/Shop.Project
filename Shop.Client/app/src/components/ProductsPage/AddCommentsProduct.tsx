import React, { FC } from "react";

export const AddCommentsProduct: FC<{ isBtnSubmitDisabeld: Boolean }> = (
  isBtnSubmitDisabeld
) => {

    console.log(isBtnSubmitDisabeld);
  return (
    <div className="product__containerAddComments">
      <form className="product__containerAddComments__containerForm">
        <div className="product__containerAddComments__containerForm--title">
          <label className="product__containerAddComments__containerForm--title--label">
            Заголовок
          </label>
          <input
            className="product__containerAddComments__containerForm--title--input"
            placeholder="Введите заголовок"
            type="text"
          />
        </div>
        <div className="product__containerAddComments__containerForm--email">
          <label className="product__containerAddComments__containerForm--email--label">
            Email
          </label>
          <input
            className="product__containerAddComments__containerForm--email--input"
            placeholder="Введите email"
            type="text"
          />
        </div>
        <div className="product__containerAddComments__containerForm--body">
          <label className="product__containerAddComments__containerForm--body--label">
            Комментарий
          </label>
          <textarea
            className="product__containerAddComments__containerForm--body--textarea"
            placeholder="Введите комментарий"
          />
        </div>

        <div className="product__containerAddComments__containerForm--submit">
          <button
            className="product__containerAddComments__containerForm--submit__btn"
            type="submit"
            disabled={isBtnSubmitDisabeld.isBtnSubmitDisabeld ? true : false}
          >
            Добавить комментарий
          </button>
        </div>
      </form>
    </div>
  );
};
