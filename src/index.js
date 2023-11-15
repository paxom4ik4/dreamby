import React, { useState, useEffect, Suspense, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import { useLayoutEffect } from 'react';

import './index.scss';
import { Header } from './components/common/header/header';
import { Main } from './components/main';
import { Footer } from './components/common/footer/footer';
import { About } from './components/about';
import { Services } from './components/services';
import { ServicePage } from './components/service_page';
import { NavPanel } from './components/common/navPanel/navPanel';
import { ItemPage } from './components/item_page';
import { Registration } from './components/common/registration/registration';
import { FavoriteItems } from './components/favorite_items/favorite_items';
import { Cart } from './components/cart/cart';
import { Compare } from './components/compare';
import { Login } from './components/login';
import { Billing } from './components/billing';
import Catalog from './components/catalog/catalog';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Admin } from './admin/admin';
import { Profile } from './components/profile/profile';
import { Info } from './components/info/info';
import { WithUs } from './components/common/with_us/with_us';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import preLoader from './Logo_Text_Dark.gif';
import screenLoader from './Logo_Screensaver.gif';
import { FooterMenu } from './components/common/footer_menu/footer_menu';
import { MobileMenu } from './components/common/header/mobile_menu/mobile_menu';

import blueGradient from './GradientBlue.svg';
import orangeGradient from './GradientOrange.svg';

export const MAX_COMPARE_ITEMS = 4;

const DEFAULT_CLASSNAME = 'app';

const Wrapper = ({ children }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    setTimeout(() => document.documentElement.scrollTo(0, 0), 500);
  }, [location.pathname]);
  return children;
};

export const Loader = () => {
  return <div className={'loader'} />;
};

export const FavoriteContext = React.createContext({});

const App = () => {
  const navigate = useNavigate();

  const favoriteNotify = () =>
    toast('Товар добавлен в избранное!', {
      type: 'info',
    });

  const favoriteDeleteNotify = () =>
    toast('Товар удален из избранных.', {
      type: 'info',
    });

  const registerNotify = () =>
    toast('Вы успешно зарегистрировались!', {
      type: 'success',
    });

  const loginNotify = () =>
    toast('Вы успешно вошли в аккаунт!', {
      type: 'success',
    });

  const loginFailed = () =>
    toast('Такого email не существует. Попробоуйте снова', {
      type: 'error',
    });

  const orderSuccess = () =>
    toast('Ваш заказ успешно оформлен. Менеджер свяжется с вами для уточнения деталей!', {
      type: 'success',
    });

  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const loginData = JSON.parse(sessionStorage.getItem('loginData'));
    const localFavoriteItems = JSON.parse(localStorage.getItem('favoriteItems'));
    const localFavoriteServices = JSON.parse(localStorage.getItem('favoriteServices'));
    const cartItems = JSON.parse(localStorage.getItem('cartItems'));

    fetch(`${process.env['REACT_APP_API_URL']}subcategory`)
      .then((res) => res.json())
      .then((data) => setSubcategories(data));

    setLoginData(loginData);
    setFavoriteItems(!!localFavoriteItems ? localFavoriteItems : []);
    setFavoriteServices(!!localFavoriteServices ? localFavoriteServices : []);
    setCartItems(!!cartItems ? (Array.isArray(cartItems) ? cartItems : []) : []);
  }, []);

  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')) || []);

  const [loginData, setLoginData] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(!!loginData);

  useEffect(() => {
    setIsLoggedIn(!!loginData);
  }, [loginData]);

  const [favoriteItems, setFavoriteItems] = useState(
    JSON.parse(localStorage.getItem('favoriteItems')) || [],
  );
  const [favoriteServices, setFavoriteServices] = useState(
    JSON.parse(localStorage.getItem('favoriteServices')) || [],
  );
  const [rerenderCart, setRerenderCart] = useState(false);

  const setFavoriteItemHandler = (item) => {
    if (Array.isArray(item)) {
      setFavoriteItems([]);
      return;
    }

    if (!!favoriteItems.find((product) => product.id === item.id)) {
      setFavoriteItems(favoriteItems.filter((product) => product.id !== item.id));
      favoriteDeleteNotify();
    } else {
      setFavoriteItems((prev) => [...prev, item]);
      favoriteNotify();
    }
  };

  const cartNotify = () =>
    toast('Товар добавлен в корзину!', {
      type: 'info',
    });

  const alreadyNotify = () =>
    toast('Товар уже добавлен в корзину.', {
      type: 'info',
    });

  const setCartItemsHandler = (item) => {
    if (!!cartItems.find((itm) => itm.id === item.id)) {
      alreadyNotify();
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          ...item,
          itemAmount: 1,
          increaseAmount: function () {
            this.itemAmount++;
            setRerenderCart((prev) => !prev);
          },
          decreaseAmount: function () {
            this.itemAmount--;
            setRerenderCart((prev) => !prev);
          },
        },
      ]);
    }
  };

  useEffect(() => {
    localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const res = fetch(`${process.env['REACT_APP_API_URL']}category`);
    res
      .then((data) => data.json())
      .then((categories) => {
        setCategories(categories);
      });
  }, []);

  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  const [compareItems, setCompareItems] = useState([]);

  const deleteFromCompare = (id, event) => {
    event.stopPropagation();
    const itemsToSet = compareItems.filter((item) => item !== id);
    setCompareItems(itemsToSet);
  };

  const addItemToCompare = (id) => {
    if (compareItems.includes(id)) {
      toast.info('Товар уже добавлен в сравнение');
    } else if (compareItems.length === MAX_COMPARE_ITEMS) {
      toast.info('Выбрано максимальное количество продуктов для сравнения');
      return;
    } else {
      setCompareItems((items) => [id, ...items]);
      toast.info('Товар добавлен в сравнение');
    }
  };

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const [selectedDeviceName, setSelectedDeviceName] = useState(null);

  const location = useLocation();

  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState('fadeIn');

  const [isAdminPage, setIsAdminPage] = useState(false);

  useEffect(() => {
    if (location.pathname.includes('admin')) {
      setIsAdminPage(true);
    }
  }, []);

  useEffect(() => {
    if (location !== displayLocation) setTransistionStage('fadeOut');
  }, [location, displayLocation]);

  const [catalogFilterOpened, setCatalogFilterOpened] = useState(false);

  useEffect(() => {
    const bodyElement = document.querySelector('body');

    if (catalogFilterOpened) {
      bodyElement.style.overflowY = 'hidden';
      bodyElement.style.background = '#FAFAFAF9';
    } else {
      bodyElement.style.overflowY = 'initial';
      bodyElement.style.background = '#FFF';
    }
  }, [catalogFilterOpened]);

  const footerRef = useRef();
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const [showInitialLoader, setShowInitialLoader] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (footerRef.current) {
        const targetPosition = footerRef.current.getBoundingClientRect();
        const isElementVisible =
          targetPosition.top < window.innerHeight && targetPosition.bottom >= 0;
        setIsFooterVisible(isElementVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Проверить видимость элемента сразу после загрузки страницы

    const timer = setTimeout(() => {
      setShowInitialLoader(false);
    }, 5700);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const [showScreenLoader, setShowScreenLoader] = useState(false);

  useEffect(() => {
    if (location.pathname.split('/').length <= 2) {
      setShowScreenLoader(true);
    }

    const timer = setTimeout(() => {
      setShowScreenLoader(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

  const queryClient = new QueryClient();

  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);

  return (
    <>
      {showInitialLoader && location.pathname === '/' && (
        <div className={'INITIAL_LOADER'}>
          <img alt={'gradient-orange'} src={blueGradient} className={`INITIAL_LOADER_BLUE`} />
          <img alt={'gradient-blue'} src={orangeGradient} className={`INITIAL_LOADER_ORANGE`} />
          <img alt={'initial_logo'} src={preLoader} />
        </div>
      )}

      {!showInitialLoader && showScreenLoader && (
        <div className={`${'INITIAL_LOADER'} ${'PAGE_LOADER'}`}>
          <img src={screenLoader} alt={'pre-screen'} />
          <img alt={'gradient-orange'} src={blueGradient} className={`INITIAL_LOADER_BLUE`} />
          <img alt={'gradient-blue'} src={orangeGradient} className={`INITIAL_LOADER_ORANGE`} />
        </div>
      )}

      <QueryClientProvider client={queryClient}>
        <WithUs isHidden={isFooterVisible || isMobileMenuOpened} />
        <Header
          setIsMobileMenuOpened={setIsMobileMenuOpened}
          isMobileMenuOpened={isMobileMenuOpened}
          setSelectedCategory={setSelectedCategory}
          isLoggedIn={isLoggedIn}
          setLoginData={setLoginData}
        />
        {window.location.pathname.startsWith('/catalog') &&
          !!selectedCategory &&
          !!selectedSubcategory &&
          !catalogFilterOpened &&
          window.location.pathname.split('/').length < 5 && (
            <div onClick={() => setCatalogFilterOpened(true)} className={'mobile-filter-btn'}>
              {'Фильтр и сортировка'}
            </div>
          )}

        {window.location.pathname !== '/compare' && compareItems.length >= 2 && (
          <div className={`${DEFAULT_CLASSNAME}_compare`}>
            Товар в сравнении: {compareItems.length}{' '}
            <span onClick={() => navigate('/compare')}>Перейти к сравнению</span>{' '}
            <span style={{ color: '#000' }} onClick={() => setCompareItems([])}>
              или очистите
            </span>
          </div>
        )}
        {window.location.pathname !== '/compare' && compareItems.length === 1 && (
          <div className={`${DEFAULT_CLASSNAME}_compare`}>
            Один товар в сравнении, выберите ещё в{' '}
            <span onClick={() => navigate('/catalog')}>Каталоге</span>{' '}
            <span style={{ color: '#000' }} onClick={() => setCompareItems([])}>
              или очистите
            </span>
          </div>
        )}
        <div
          className={`${DEFAULT_CLASSNAME} ${isAdminPage && 'admin-page'} ${transitionStage}`}
          onAnimationEnd={() => {
            if (transitionStage === 'fadeOut') {
              setTransistionStage('fadeIn');
              setDisplayLocation(location);
            }
          }}>
          <NavPanel
            setSelectedDeviceName={setSelectedDeviceName}
            subcategories={subcategories}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSelectedSubcategories={setSelectedSubcategories}
            selectedDeviceName={selectedDeviceName}
            selectedSubcategories={selectedSubcategories}
          />
          <FavoriteContext.Provider
            value={{ setFavoriteItems: setFavoriteItemHandler, favoriteItems, favoriteNotify }}>
            <Wrapper>
              <Routes location={displayLocation}>
                <Route
                  path={'/'}
                  element={
                    <Main
                      setSelectedCategoryName={setSelectedCategoryName}
                      favoriteServices={favoriteServices}
                      favoriteItems={favoriteItems}
                      setSelectedCategory={setSelectedCategory}
                      favoriteNotify={favoriteNotify}
                      setFavoriteItems={setFavoriteItemHandler}
                      setCartItems={setCartItemsHandler}
                      categories={categories}
                      setCategories={setCategories}
                    />
                  }
                />
                <Route
                  path={'/about'}
                  element={
                    <About
                      setSelectedCategory={setSelectedCategory}
                      favoriteItems={favoriteItems}
                      favoriteNotify={favoriteNotify}
                      setFavoriteItems={setFavoriteItemHandler}
                      setCartItems={setCartItemsHandler}
                    />
                  }
                />
                <Route
                  path={'/services'}
                  element={
                    <Services
                      setSelectedCategory={setSelectedCategory}
                      catalogFilterOpened={catalogFilterOpened}
                      setCartItem={setCartItems}
                      favoriteCatalogItems={favoriteItems}
                      favoriteItems={favoriteServices}
                      favoriteNotify={favoriteNotify}
                      setFavoriteItems={setFavoriteItemHandler}
                      setCartItems={setCartItemsHandler}
                    />
                  }
                />
                <Route
                  path={'/services/:id'}
                  element={
                    <ServicePage
                      cartItems={cartItems}
                      setCartItems={setCartItems}
                      isAuthorized={isLoggedIn}
                      setLoginData={setLoginData}
                    />
                  }
                />
                <Route
                  path={'/catalog'}
                  element={
                    <Catalog
                      setSelectedDeviceName={setSelectedDeviceName}
                      allSubcategories={subcategories}
                      selectedSubcategory={selectedSubcategory}
                      setSelectedSubcategory={setSelectedSubcategory}
                      catalogFilterOpened={catalogFilterOpened}
                      setCatalogFilterOpened={setCatalogFilterOpened}
                      compareItems={compareItems}
                      selectedSubcategories={selectedSubcategories}
                      setSelectedSubcategories={setSelectedSubcategories}
                      addItemToCompare={addItemToCompare}
                      selectedCategoryName={selectedCategoryName}
                      setSelectedCategoryName={setSelectedCategoryName}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      categories={categories}
                      setCartItems={setCartItemsHandler}
                    />
                  }>
                  <Route
                    path={'/catalog/:category'}
                    element={
                      <Catalog
                        setSelectedDeviceName={setSelectedDeviceName}
                        allSubcategories={subcategories}
                        selectedSubcategory={selectedSubcategory}
                        setSelectedSubcategory={setSelectedSubcategory}
                        catalogFilterOpened={catalogFilterOpened}
                        setCatalogFilterOpened={setCatalogFilterOpened}
                        compareItems={compareItems}
                        selectedSubcategories={selectedSubcategories}
                        setSelectedSubcategories={setSelectedSubcategories}
                        addItemToCompare={addItemToCompare}
                        selectedCategoryName={selectedCategoryName}
                        setSelectedCategoryName={setSelectedCategoryName}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        categories={categories}
                        setCartItems={setCartItemsHandler}
                      />
                    }>
                    <Route
                      path={'/catalog/:category/:subcategory'}
                      element={
                        <Catalog
                          setSelectedDeviceName={setSelectedDeviceName}
                          allSubcategories={subcategories}
                          selectedSubcategory={selectedSubcategory}
                          setSelectedSubcategory={setSelectedSubcategory}
                          catalogFilterOpened={catalogFilterOpened}
                          setCatalogFilterOpened={setCatalogFilterOpened}
                          compareItems={compareItems}
                          selectedSubcategories={selectedSubcategories}
                          setSelectedSubcategories={setSelectedSubcategories}
                          addItemToCompare={addItemToCompare}
                          selectedCategoryName={selectedCategoryName}
                          setSelectedCategoryName={setSelectedCategoryName}
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                          categories={categories}
                          setCartItems={setCartItemsHandler}
                        />
                      }
                    />
                  </Route>
                </Route>
                <Route
                  path={'/catalog/:category/:subcategory/:id'}
                  element={
                    <Suspense fallback={<Loader />}>
                      <ItemPage
                        setCartItems={setCartItems}
                        allSubcategories={subcategories}
                        setSelectedSubcategory={setSelectedSubcategory}
                        compareItems={compareItems}
                        setSelectedCategory={setSelectedCategory}
                        selectedCategory={selectedCategory}
                        setSelectedSubcategories={setSelectedSubcategories}
                        setSelectedDeviceName={setSelectedDeviceName}
                        setLoginData={setLoginData}
                        setFavoriteItems={setFavoriteItemHandler}
                        favoriteItems={favoriteItems}
                        loginData={loginData}
                        addItemToCompare={addItemToCompare}
                        addToCart={setCartItemsHandler}
                      />{' '}
                    </Suspense>
                  }
                />
                <Route
                  path={'/registration'}
                  element={<Registration registerNotify={registerNotify} registrationMode={true} />}
                />
                <Route
                  path={'/favorite'}
                  element={
                    <FavoriteItems
                      setFavoriteItems={setFavoriteItemHandler}
                      setCartItems={setCartItemsHandler}
                      favoriteItems={favoriteItems}
                      favoriteServices={favoriteServices}
                    />
                  }
                />
                <Route
                  path={'/cart'}
                  element={
                    <Cart
                      setCartItems={setCartItems}
                      orderSuccess={orderSuccess}
                      cartItems={cartItems}
                      loginData={loginData}
                      rerenderCart={rerenderCart}
                    />
                  }
                />
                <Route
                  path={'/compare'}
                  element={
                    <Compare
                      setSelectedDeviceName={setSelectedDeviceName}
                      deleteFromCompare={deleteFromCompare}
                      compareItems={compareItems}
                    />
                  }
                />
                <Route
                  path={'/login'}
                  element={
                    <Login
                      loginNotify={loginNotify}
                      loginFailed={loginFailed}
                      setIsLoggedIn={setIsLoggedIn}
                      setLoginData={setLoginData}
                    />
                  }
                />
                <Route path={'/billing'} element={<Billing />} />
                <Route path={'/admin/*'} element={<Admin />} />
                <Route path={'/admin/*'} element={<Admin />} />
                <Route path={'/profile'} element={<Profile />} />
                <Route path={'/info'} element={<Info />} />
                <Route
                  path="*"
                  element={
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100vh',
                      }}>
                      <h3>404. Страница не найдена</h3>
                      <Link style={{ color: '#0866D7', fontWeight: '400' }} to={'/'}>
                        Вернуться на главную
                      </Link>
                    </div>
                  }
                />
              </Routes>
            </Wrapper>
          </FavoriteContext.Provider>
          {!catalogFilterOpened && <Footer footerRef={footerRef} />}
        </div>
        <ToastContainer />
        <MobileMenu
          isMobileMenuOpened={isMobileMenuOpened}
          setIsMobileMenuOpened={setIsMobileMenuOpened}
          compareItems={compareItems.length}
        />
        <FooterMenu setIsMobileMenuOpened={setIsMobileMenuOpened} />
      </QueryClientProvider>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
