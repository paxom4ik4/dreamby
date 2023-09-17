import React, {useState, useEffect, Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Routes, Route, useLocation, useNavigate, Link} from "react-router-dom";
import {useLayoutEffect} from 'react';

import './index.scss'
import { Header } from "./components/common/header/header";
import { Main } from "./components/main";
import { Footer } from "./components/common/footer/footer";
import { About } from "./components/about";
import { Services } from "./components/services";
import { ServicePage } from "./components/service_page";
import { NavPanel } from "./components/common/navPanel/navPanel";
import { ItemPage } from "./components/item_page";
import { Registration } from "./components/common/registration/registration";
import { FavoriteItems } from "./components/favorite_items/favorite_items";
import { Cart } from "./components/cart/cart";
import { Compare } from "./components/compare";
import { Login } from "./components/login";
import { Billing } from "./components/billing";
import { Catalog } from "./components/catalog/catalog";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Admin} from "./admin/admin";
import {Profile} from "./components/profile/profile";
import {Info} from "./components/info/info";

export const MAX_COMPARE_ITEMS = 4;

const DEFAULT_CLASSNAME = 'app';

const Wrapper = ({children}) => {
  const location = useLocation();
  useLayoutEffect(() => {
    setTimeout(() => document.documentElement.scrollTo(0, 0), 500)
  }, [location.pathname]);
  return children
}

export const Loader = () => {
  return (
      <div className={'loader'} />
  )
}

const App = () => {
  const navigate = useNavigate();

  const favoriteNotify = () => toast("Товар добавлен в избранное!", {
    type: "info"
  });

  const favoriteDeleteNotify = () => toast("Товар удален из избранных.", {
    type: "info"
  });

  const favoriteServiceNotify = () => toast("Услуга добавлена в избранное!", {
    type: "info"
  });

  const favoriteDeleteServiceNotify = () => toast("Услуга удалена из избранных.", {
    type: "info"
  });

  const registerNotify = () => toast("Вы успешно зарегистрировались!", {
    type: "success"
  })

  const loginNotify = () => toast("Вы успешно вошли в аккаунт!", {
    type: "success"
  })

  const loginFailed = () => toast("Такого email не существует. Попробоуйте снова", {
    type: "error"
  })

  const orderSuccess = () => toast("Ваш заказ успешно оформлен. Менеджер свяжется с вами для уточнения деталей!", {
    type: "success",
  })

  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const loginData = JSON.parse(sessionStorage.getItem('loginData'))
    const localFavoriteItems = JSON.parse(localStorage.getItem('favoriteItems'));
    const localFavoriteServices = JSON.parse(localStorage.getItem('favoriteServices'));
    const cartItems = JSON.parse(localStorage.getItem('cartItems'));

    fetch(`${process.env["REACT_APP_API_URL"]}subcategory`)
      .then(res => res.json())
      .then(data => setSubcategories(data));

    setLoginData(loginData);
    setFavoriteItems(!!localFavoriteItems ? localFavoriteItems : []);
    setFavoriteServices(!!localFavoriteServices ? localFavoriteServices : []);
    setCartItems(!!cartItems ? Array.isArray(cartItems) ? cartItems : [] : []);
  }, [])

  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')) || []);

  const [loginData, setLoginData] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(!!loginData);

  useEffect(() => {
    setIsLoggedIn(!!loginData);
  }, [loginData]);

  const [favoriteItems, setFavoriteItems] = useState(JSON.parse(localStorage.getItem('favoriteItems')) || []);
  const [favoriteServices, setFavoriteServices] = useState(JSON.parse(localStorage.getItem('favoriteServices')) || []);
  const [rerenderCart, setRerenderCart] = useState(false)

  const setFavoriteItemHandler = (itemId) => {
    if(Array.isArray(itemId)) {
      setFavoriteItems([]);
      return;
    }

    if (favoriteItems.includes(itemId)) {
      setFavoriteItems(favoriteItems.filter(id => id !== itemId))
      favoriteDeleteNotify();
    } else {
      setFavoriteItems(prev => ([...prev, itemId]))
      favoriteNotify();
    }
  }

  const setFavoriteServiceHandler = (itemId) => {
    if(Array.isArray(itemId)) {
      setFavoriteServices([]);
      return;
    }

    if (favoriteServices.includes(itemId)) {
      setFavoriteServices(favoriteServices.filter(id => id !== itemId));
      favoriteDeleteServiceNotify();
    } else {
      setFavoriteServices(prev => ([...prev, itemId]));
      favoriteServiceNotify();
    }
  }

  const cartNotify = () => toast("Товар добавлен в корзину!", {
    type: "info"
  });

  const alreadyNotify = () => toast("Товар уже добавлен в корзину.", {
    type: "info"
  });

  const setCartItemsHandler = (item) => {
    if (!!cartItems.find(itm => itm.id === item.id)) {
      alreadyNotify();
    } else {
      setCartItems(prev => ([...prev, {
        ...item,
        itemAmount: 1,
        increaseAmount: function() {
          this.itemAmount++;
          setRerenderCart(prev => !prev)
        },
        decreaseAmount: function() {
          this.itemAmount--;
          setRerenderCart(prev => !prev)
        }
      }]))
    }
  }

  useEffect(() => {
    localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
  }, [favoriteItems])

  useEffect(() => {
    localStorage.setItem('favoriteServices', JSON.stringify(favoriteServices));
  }, [favoriteServices])

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems])

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const res = fetch(`${process.env["REACT_APP_API_URL"]}category`)
    res.then(data => data.json()).then(categories => {
      setCategories(categories);
    })
  }, [])

  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const [compareItems, setCompareItems] = useState([]);

  const deleteFromCompare = (id, event) => {
    event.stopPropagation();
    const itemsToSet = compareItems.filter(item => item !== id);
    setCompareItems(itemsToSet);
  }

  const addItemToCompare = (id) => {
    if (compareItems.includes(id)) {
      toast.info("Товар уже добавлен в сравнение");
    } else if (compareItems.length === MAX_COMPARE_ITEMS) {
      toast.info("Выбрано максимальное количество продуктов для сравнения");
      return;
    } else {
      setCompareItems(items => [id, ...items]);
      toast.info("Товар добавлен в сравнение");
    }
  }

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const [selectedDeviceName, setSelectedDeviceName] = useState(null);

  const location = useLocation();

  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");

  const [isAdminPage, setIsAdminPage] = useState(false);

  useEffect(() => {
    if (location.pathname.includes('admin')) {
      setIsAdminPage(true);
    }
  }, [])

  useEffect(() => {
    if (location !== displayLocation) setTransistionStage("fadeOut");
  }, [location, displayLocation]);

  const [catalogFilterOpened, setCatalogFilterOpened] = useState(false);

  useEffect(() => {
    const bodyElement = document.querySelector("body");

    if (catalogFilterOpened) {
      bodyElement.style.overflowY = "hidden";
      bodyElement.style.background = "#FAFAFAF9"
    } else {
      bodyElement.style.overflowY = "initial";
      bodyElement.style.background = "#FFF"
    }

  }, [catalogFilterOpened]);

  return (
    <>
      {window.location.pathname.startsWith("/catalog") && !!selectedCategory && !!selectedSubcategory && !catalogFilterOpened && (window.location.pathname.split('/').length < 5) && <div onClick={() => setCatalogFilterOpened(true)} className={"mobile-filter-btn"}>{"Фильтр и сортировка"}</div>}

      {window.location.pathname !== "/compare" && compareItems.length >= 2 && <div className={`${DEFAULT_CLASSNAME}_compare`}>Товар в сравнении: {compareItems.length} <span onClick={() => navigate('/compare')}>Перейти к сравнению</span> <span style={{ color: "#000" }} onClick={() => setCompareItems([])}>или очистите</span></div>}
      {window.location.pathname !== "/compare" && compareItems.length === 1 && <div className={`${DEFAULT_CLASSNAME}_compare`}>Один товар в сравнении, выберите ещё в <span onClick={() => navigate('/catalog')}>Каталоге</span> <span style={{ color: "#000" }} onClick={() => setCompareItems([])}>или очистите</span></div>}
      <div className={`${DEFAULT_CLASSNAME} ${isAdminPage && "admin-page"} ${transitionStage}`} onAnimationEnd={() => {
        if (transitionStage === "fadeOut") {
          setTransistionStage("fadeIn");
          setDisplayLocation(location);
        }
      }}>
        <Header setSelectedCategory={setSelectedCategory} isLoggedIn={isLoggedIn} setLoginData={setLoginData} />
        <NavPanel subcategories={subcategories} selectedSubcategory={selectedSubcategory} setSelectedSubcategory={setSelectedSubcategory} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} setSelectedSubcategories={setSelectedSubcategories} selectedDeviceName={selectedDeviceName} selectedSubcategories={selectedSubcategories} />
        <Wrapper>
          <Routes location={displayLocation}>
            <Route path={"/"} element={<Main setSelectedCategoryName={setSelectedCategoryName} favoriteServices={favoriteServices} favoriteItems={favoriteItems} setSelectedCategory={setSelectedCategory} favoriteNotify={favoriteNotify} setFavoriteServices={setFavoriteServiceHandler} setFavoriteItems={setFavoriteItemHandler} setCartItems={setCartItemsHandler} categories={categories} setCategories={setCategories} />} />
            <Route path={"/about"} element={<About setSelectedCategory={setSelectedCategory} favoriteItems={favoriteItems} favoriteNotify={favoriteNotify} setFavoriteItems={setFavoriteItemHandler} setCartItems={setCartItemsHandler} />} />
            <Route path={"/services"} element={<Services setSelectedCategory={setSelectedCategory} catalogFilterOpened={catalogFilterOpened} setCartItem={setCartItems} favoriteCatalogItems={favoriteItems} favoriteItems={favoriteServices} favoriteNotify={favoriteNotify} setFavoriteItems={setFavoriteItemHandler} setFavoriteServices={setFavoriteServiceHandler} setCartItems={setCartItemsHandler} />} />
            <Route path={"/services/:id"} element={<ServicePage cartItems={cartItems} setCartItems={setCartItems} isAuthorized={isLoggedIn} setLoginData={setLoginData} />} />
            <Route path={"/catalog"} element={<Catalog allSubcategories={subcategories} selectedSubcategory={selectedSubcategory} setSelectedSubcategory={setSelectedSubcategory} catalogFilterOpened={catalogFilterOpened} setCatalogFilterOpened={setCatalogFilterOpened} compareItems={compareItems} selectedSubcategories={selectedSubcategories} setSelectedSubcategories={setSelectedSubcategories} addItemToCompare={addItemToCompare} selectedCategoryName={selectedCategoryName} setSelectedCategoryName={setSelectedCategoryName} favoriteItems={favoriteItems} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} favoriteNotify={favoriteNotify} setFavoriteItems={setFavoriteItemHandler} setCartItems={setCartItemsHandler} />}>
              <Route path={"/catalog/:category"} element={<Catalog allSubcategories={subcategories} selectedSubcategory={selectedSubcategory} setSelectedSubcategory={setSelectedSubcategory} catalogFilterOpened={catalogFilterOpened} setCatalogFilterOpened={setCatalogFilterOpened} compareItems={compareItems} selectedSubcategories={selectedSubcategories} setSelectedSubcategories={setSelectedSubcategories} addItemToCompare={addItemToCompare} selectedCategoryName={selectedCategoryName} setSelectedCategoryName={setSelectedCategoryName} favoriteItems={favoriteItems} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} favoriteNotify={favoriteNotify} setFavoriteItems={setFavoriteItemHandler} setCartItems={setCartItemsHandler} />}>
                <Route path={"/catalog/:category/:subcategory"} element={<Catalog allSubcategories={subcategories} selectedSubcategory={selectedSubcategory} setSelectedSubcategory={setSelectedSubcategory} catalogFilterOpened={catalogFilterOpened} setCatalogFilterOpened={setCatalogFilterOpened} compareItems={compareItems} selectedSubcategories={selectedSubcategories} setSelectedSubcategories={setSelectedSubcategories} addItemToCompare={addItemToCompare} selectedCategoryName={selectedCategoryName} setSelectedCategoryName={setSelectedCategoryName} favoriteItems={favoriteItems} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} favoriteNotify={favoriteNotify} setFavoriteItems={setFavoriteItemHandler} setCartItems={setCartItemsHandler} />} />
              </Route>
            </Route>
            <Route path={"/catalog/:category/:subcategory/:id"} element={
              <Suspense fallback={<Loader />}><ItemPage setCartItems={setCartItems} allSubcategories={subcategories} setSelectedSubcategory={setSelectedSubcategory} compareItems={compareItems} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} setSelectedSubcategories={setSelectedSubcategories} setSelectedDeviceName={setSelectedDeviceName} setLoginData={setLoginData} setFavoriteItems={setFavoriteItemHandler} favoriteItems={favoriteItems} loginData={loginData} addItemToCompare={addItemToCompare} addToCart={setCartItemsHandler} /> </Suspense>
            } />
            <Route path={"/registration"} element={<Registration registerNotify={registerNotify} registrationMode={true} />} />
            <Route path={"/favorite"} element={<FavoriteItems setFavoriteItems={setFavoriteItemHandler} setFavoriteServices={setFavoriteServiceHandler} setCartItems={setCartItemsHandler} favoriteItems={favoriteItems} favoriteServices={favoriteServices} />} />
            <Route path={"/cart"} element={<Cart setCartItems={setCartItems} orderSuccess={orderSuccess} cartItems={cartItems} loginData={loginData} rerenderCart={rerenderCart} />} />
            <Route path={"/compare"} element={<Compare deleteFromCompare={deleteFromCompare} compareItems={compareItems} />} />
            <Route path={"/login"} element={<Login loginNotify={loginNotify} loginFailed={loginFailed} setIsLoggedIn={setIsLoggedIn} setLoginData={setLoginData} />} />
            <Route path={"/billing"} element={<Billing />} />
            <Route path={"/admin/*"} element={<Admin />} />
            <Route path={"/admin/*"} element={<Admin />} />
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/info"} element={<Info />} />
            <Route path="*" element={<div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", height: "100vh"}}>
              <h3>404. Страница не найдена</h3>
              <Link style={{ color: "#0866D7", fontWeight: "400" }} to={"/"}>Вернуться на главную</Link>
            </div>} />
          </Routes>
        </Wrapper>
        {!catalogFilterOpened && <Footer />}
      </div>
      <ToastContainer />
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
