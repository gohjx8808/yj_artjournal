import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { graphql, useStaticQuery } from 'gatsby';
import {
  GatsbyImage, getImage, IGatsbyImageData,
} from 'gatsby-plugin-image';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import { useAppSelector } from '../../../hooks';
import productStyle from '../src/productStyle';
import ProductCard from './ProductCard';

interface categoryAmountData{
  [key:string]:number
}

interface imageInnerData{
  node:{
    name:string
    childImageSharp:IGatsbyImageData
    id:string
  }
}

const Products = () => {
  const styles = productStyle();
  const productFilterKeyword = useAppSelector((state) => state.product.productFilterKeyword);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryProductAmount, setCategoryProductAmount] = useState<categoryAmountData>({});
  const productQuery = useStaticQuery(graphql`
    query {
      productCategoriesImages: allFile(filter: {relativeDirectory: {eq: "productCategories"}}) {
        edges {
          node {
            childImageSharp {
              gatsbyImageData
            }
            id
            name
          }
        }
      }
      ProductPrices: allContentfulProducts(filter: {node_locale: {eq: "en-US"}}) {
        edges {
          node {
            name
            contentful_id
            category
            productImage {
              gatsbyImageData
            }
            price
            contentDescription {
              raw
            }
          }
        }
      }
    }`);

  const filterProductKeyword = useCallback(
    (productName:string) => {
      if (productFilterKeyword) {
        return productName.toLowerCase().includes(
          productFilterKeyword.toLowerCase(),
        );
      }
      return true;
    }, [productFilterKeyword],
  );

  useEffect(() => {
    const categoryList = [] as string[];
    const categoryAmount = {} as categoryAmountData;
    productQuery.ProductPrices.edges.map(
      (product:products.innerProductQueryData) => {
        const productCategory = product.node.category;
        if (productCategory) {
          if (filterProductKeyword(product.node.name)) {
            if (categoryAmount[productCategory]) {
              categoryAmount[productCategory] += 1;
            } else {
              categoryAmount[productCategory] = 1;
            }
          }
          if (!categoryList.includes(productCategory)) {
            categoryList.push(productCategory);
          }
        }
        return null;
      },
    );
    setCategoryProductAmount(categoryAmount);
    setCategories(categoryList);
  }, [productQuery, filterProductKeyword]);

  const filterProduct = (product:products.innerProductQueryData, category:string) => {
    const isProductInFilter = filterProductKeyword(product.node.name);
    let isProductInCategory = true;
    if (product.node.category) {
      isProductInCategory = product.node.category === category;
    }
    return isProductInFilter && isProductInCategory;
  };

  return (
    <>
      {categories.map((category) => {
        // eslint-disable-next-line max-len
        const currentCategoryImageData:imageInnerData = productQuery.productCategoriesImages.edges.find(
          (image:imageInnerData) => image.node.name === category.toLowerCase().replace(' series', ''),
        );
        const categoryImage = getImage(currentCategoryImageData.node.childImageSharp)!;
        return (
          <Button disabled={!categoryProductAmount[category]} key={category} style={{ width: '20%' }}>
            <Link
              to={category}
              spy
              smooth
              offset={-60}
            >
              <GatsbyImage
                image={categoryImage}
                alt={currentCategoryImageData.node.name}
                imgStyle={{ borderRadius: 10 }}
              />
            </Link>
          </Button>
        );
      })}
      {categories.map((category) => (
        <Grid container justifyContent="center" alignItems="center" direction="column" key={category}>
          {categoryProductAmount[category] && (
            <Grid container justifyContent="flex-start" alignItems="center">
              <Typography variant="h6" id={category} className={styles.categorySpacing}>{category}</Typography>
            </Grid>
          )}
          <Grid container justifyContent="center" alignItems="center" direction="row" spacing={5} key={category}>
            {productQuery.ProductPrices.edges.filter(
              (product:products.innerProductQueryData) => filterProduct(product, category),
            ).map((product:products.innerProductQueryData) => (
              <ProductCard key={product.node.contentful_id} product={product.node} />
            ))}
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default Products;
