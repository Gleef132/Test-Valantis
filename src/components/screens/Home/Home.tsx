'use client'

import { FC, createContext, useState } from 'react'

import { ConfigProvider, theme } from 'antd'

import Filters from '@/components/Filters'
import ProductList from '@/components/ProductList'
import Search from '@/components/Search'

import cl from './Home.module.scss'

interface IAppContext {
  searchValue: string;
  setSearchValue: (value: string) => void;
  brandFileter: string;
  setBrandFilter: (value: string) => void;
  priceFilter: number | undefined;
  setPriceFilter: (value: number) => void;
}


// Создаем контекст вместо state meneger'ов ведь проект маленький
export const AppContext = createContext<IAppContext | undefined>(undefined)

interface IHomePageProps {
  brands: string[]
}

const HomePage: FC<IHomePageProps> = ({ brands }) => {

  const [searchValue, setSearchValue] = useState<string>('')
  const [brandFileter, setBrandFilter] = useState<string>('')
  const [priceFilter, setPriceFilter] = useState<number | undefined>(undefined)

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <AppContext.Provider value={{ searchValue, setSearchValue, brandFileter, setBrandFilter, priceFilter, setPriceFilter }}>

        <aside className={cl.home__aside}>
          <Filters brands={brands} />
        </aside>
        <div className={cl.home__content}>
          <Search />
          <ProductList />
        </div>
      </AppContext.Provider>
    </ConfigProvider>
  )
}

export default HomePage