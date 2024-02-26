'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useState } from 'react'

import { Box, Button, Flex, Text } from '@radix-ui/themes';

import { AppContext } from '@/components/screens/Home/Home';
import { IBodyRequest } from '@/models/IBodyRequest';
import { IProduct } from '@/models/IProduct';
import { getFilteredProductIds, getProductsByIds } from '@/api/index';
import { useDebounce } from '@/hooks/useDebounce';

import Loader from '@/components/ui/loader/loader';
import ProductItem from './ProductItem';

interface IProductsCache {
  [key: number]: IProduct[];
};

const ProductList: FC = () => {
  const context = useContext(AppContext)
  if (!context) throw Error('AppContext not found');
  const { searchValue, brandFileter, priceFilter } = context
  const [productsCache, setProductsCache] = useState<IProductsCache>({});
  const [products, setProducts] = useState<IProduct[]>([])
  const [allSearchedProductIds, setAllSearchedProductIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const [offset, setOffset] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const limit = 50
  const debouncedValue = useDebounce<string>(searchValue, 500)
  const [isAborted, setIsAborted] = useState<boolean>(false);

  const [prevDebouncedValue, setPrevDebouncedValue] = useState<string>('')
  const [prevBrandFileter, setPrevBrandFileter] = useState<string>('')
  const [prevPriceFilter, setPrevPriceFilter] = useState<number | undefined>(undefined)

  const fetchProducts = async (signal?: AbortSignal) => {
    // Делаем проверку на то, был ли запрос сделан ранее
    if (debouncedValue === prevDebouncedValue && brandFileter === prevBrandFileter && priceFilter === prevPriceFilter) {
      if (productsCache[offset]) {
        setProducts(productsCache[offset]);
        setPage(Math.floor(offset / limit) + 1)
        return;
      }
    } else {
      setProductsCache({})
      setPage(1)
      setOffset(0)
    }
    if (prevDebouncedValue && debouncedValue === '') {
      setProductsCache({})
      setPage(1)
      setOffset(0)
    }

    let filterBodyRequest: IBodyRequest = { action: "filter", params: {} }

    if (brandFileter) {
      filterBodyRequest.params.brand = brandFileter;
    }

    if (priceFilter) {
      filterBodyRequest.params.price = priceFilter;
    }

    if (debouncedValue) {
      filterBodyRequest.params.product = debouncedValue;
    }

    const requestBody: IBodyRequest = debouncedValue || brandFileter || priceFilter
      ? filterBodyRequest
      : { action: "get_ids", params: { limit: limit, offset: offset } };
    setIsLoading(true)
    try {
      // Получаем id продуктов
      let ids;
      if (debouncedValue && debouncedValue === prevDebouncedValue && brandFileter === prevBrandFileter && priceFilter === prevPriceFilter) {
        ids = allSearchedProductIds
      } else {
        ids = await getFilteredProductIds(requestBody, signal);
        setAllSearchedProductIds(ids)
      }
      const uniqueProducts = await getProductsByIds(debouncedValue ? ids.slice(offset, offset + limit) : ids, signal)

      setProducts(uniqueProducts)
      // Заполняем кеш с данными о продуктах, чтобы не делать запрос каждый раз, если они не поменялись.
      setProductsCache(prevCache => ({ ...prevCache, [offset]: uniqueProducts }));
      setPage(Math.floor(offset / limit) + 1)
      setIsLoading(false)
      setPrevDebouncedValue(debouncedValue)
      setPrevBrandFileter(brandFileter)
      setPrevPriceFilter(priceFilter)
    } catch (error) {
      // Если пользователь прервал запрос или первая ошибка сервера то пробуем еще раз
      console.log(error)
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setIsAborted(true);
          setIsLoading(true);
          return;
        }
      }
      try {
        let ids;
        if (debouncedValue && debouncedValue === prevDebouncedValue && brandFileter === prevBrandFileter && priceFilter === prevPriceFilter) {
          ids = allSearchedProductIds
        } else {
          ids = await getFilteredProductIds(requestBody, signal);
          setAllSearchedProductIds(ids)
        }
        const uniqueProducts = await getProductsByIds(debouncedValue ? ids.slice(offset, offset + limit) : ids, signal)
        setProducts(uniqueProducts)
        setProductsCache(prevCache => ({ ...prevCache, [offset]: uniqueProducts }));
        setPage(Math.floor(offset / limit) + 1)
        setIsLoading(false)
        setPrevDebouncedValue(debouncedValue)
        setPrevBrandFileter(brandFileter)
        setPrevPriceFilter(priceFilter)
      } catch (retryError) {
        // Если пользователь отменил запрос или сервер вернул ошибку
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            return
          }
        }
        console.log('Server Error', retryError)
        setIsLoading(false)
        setError(true)
      }
    }
  }

  useEffect(() => {
    const abortController = new AbortController();
    fetchProducts(abortController.signal);
    return () => {
      abortController.abort()
    }
  }, [debouncedValue, offset, brandFileter, priceFilter]);

  useEffect(() => {
    if (isAborted) {
      setIsAborted(false);
      fetchProducts();
    }
  }, [isAborted]);

  const onNext = () => {
    setOffset(prevOffset => prevOffset + limit)
  };
  const onPrev = () => {
    setOffset(prevOffset => prevOffset - limit)
  };

  return (
    <>
      {!isLoading && !error && !!products.length && <Text size={'4'} mt={'-3'} mb={'-3'}>Page: {page}</Text>}
      <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}>
        {isLoading && <Box mt={'9'}><Loader /></Box>}
        {!isLoading && !error && !!products.length &&
          <Flex gap={'5'} justify={'between'} width={'100%'}>
            <Flex gap={'8'} height={'max-content'} wrap={'wrap'}>
              {products.map(product => <ProductItem key={product.id} {...product} />)}
            </Flex>
            <Flex gap={'2'} style={{ position: 'sticky', top: '10px' }} height={'max-content'} >
              <Button disabled={page === 1} onClick={onPrev}>Prev</Button>
              <Button disabled={debouncedValue || brandFileter || priceFilter ? products.length < limit : offset + limit >= 8000} onClick={onNext}>Next</Button>
            </Flex>
          </Flex>
        }
        {error && !isLoading && !products.length && <Text size={'6'} mt={'8'} color='red'>Something went wrong</Text>}
        {!products.length && !error && !isLoading && <Text size={'6'} mt={'8'} color='red' >No products found</Text>}
      </div>
    </>
  )
}

export default ProductList