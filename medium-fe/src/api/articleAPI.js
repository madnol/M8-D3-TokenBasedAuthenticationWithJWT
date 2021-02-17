import axios from "axios";

const { REACT_APP_BE_URL } = process.env;

export const getArticles = async () => {
  try {
    const response = await fetch(REACT_APP_BE_URL);
    console.log("response", response);

    if (response.ok) {
      const data = await response.json();
      console.log("Articles:", data);
      return data;
    } else {
      const err = await response.json();
      return err;
    }
  } catch (error) {
    const err = await response.json();
    return err;
  }
};

export const postArticle = async () => {
  try {
    const response = await fetch(REACT_APP_BE_URL, {
      method: "POST",
      headers: { "Content-Type": "appllication/json" },
      body: JSON.stringify(article),
    });

    if (response.ok) {
      alert("successfully added!");
      const result = await response.json();
      return result;
    } else {
      alert("something wrong  ");
      const err = await response.json();
      return err;
    }
  } catch (error) {
    const err = await response.json();
    return err;
  }
};

export const removeArticle = async articleId => {
  try {
    REACT_APP_BE_URL;
    const response = await fetch(`${REACT_APP_BE_URL / articleId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      return "Article Deleted";
    } else {
      return "something went wrong";
    }
  } catch (error) {
    return error;
  }
};
