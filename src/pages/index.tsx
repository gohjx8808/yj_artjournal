import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ImageListItem from "@mui/material/ImageListItem";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { productLocalStorageKeys } from "@utils/localStorageKeys";
import { graphql, Link as GatsbyLink, navigate, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";
import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import HomeImageList from "../styledComponents/home/HomeImageList";
import routeNames from "../utils/routeNames";

const HomeScreen = () => {
  const [productImages, setProductImages] = useState<ImageDataLike[]>([]);
  const homeQuery = useStaticQuery(graphql`
    query {
      products: allContentfulProducts(
        filter: { node_locale: { eq: "en-US" } }
      ) {
        edges {
          node {
            name
            contentful_id
            category
            productImage {
              gatsbyImageData(placeholder: BLURRED)
            }
            price
            contentDescription {
              raw
            }
            discountedPrice
          }
        }
      }
    }
  `);

  useEffect(() => {
    const extractedProducts: products.innerProductQueryData[] =
      homeQuery.products.edges;
    localStorage.setItem(
      productLocalStorageKeys.products,
      JSON.stringify(extractedProducts)
    );
    const tempProduct: ImageDataLike[] = [];
    extractedProducts.every((product) => {
      if (tempProduct.length < 25) {
        tempProduct.push(product.node.productImage[0]);
        return true;
      }
      return false;
    });
    setProductImages(tempProduct);
  }, [homeQuery.products.edges]);

  return (
    <MainLayout homeCarouselBanner>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        marginTop={10}
      >
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
          >
            <Typography variant="h4" color="secondary" marginBottom={3}>
              Welcome!
            </Typography>
            <Typography variant="h6" textAlign="center">
              Hello! Welcome to the path towards my Dream! YJ Art Journal!
            </Typography>
            <Typography variant="h6" textAlign="center" marginBottom={3}>
              You are very welcome to browse along and hope it will lighten up
              your day! Enjoy!
            </Typography>
            <Link
              component={GatsbyLink}
              to={routeNames.learnMore}
              underline="hover"
            >
              <Typography
                variant="subtitle1"
                color="secondary"
                textAlign="center"
              >
                ABOUT MY SHOP
              </Typography>
            </Link>
          </Grid>
        </Grid>
        <Grid container marginTop={10} marginBottom={3} direction="column">
          <Typography variant="h5" color="secondary">
            Product Gallery
          </Typography>
        </Grid>
        <HomeImageList rowHeight="auto" cols={5}>
          {productImages.map((image) => {
            const productImagesData = getImage(image)!;
            return (
              <ImageListItem key={productImagesData.images.fallback?.src}>
                <GatsbyImage
                  image={productImagesData}
                  alt={productImagesData.images.fallback?.src!}
                />
              </ImageListItem>
            );
          })}
        </HomeImageList>
        <IconButton
          aria-label="more product images"
          onClick={() => navigate(routeNames.imageGallery)}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Grid>
    </MainLayout>
  );
};

export default HomeScreen;
