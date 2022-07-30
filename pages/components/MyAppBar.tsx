import React from "react";
import styles from "../../styles/Home.module.css";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";
import Hamburger from "hamburger-react";
import { Box, Button, Container, Typography } from "@mui/material";

const MyAppBar = () => {
  const navItems = ["Home", "Catogeries", "About", "Contact"];
  return (
    <header className={styles.appbar}>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box component="div" sx={{ flex: "2" }}>
          <Typography variant="h4">Furniture</Typography>
        </Box>
        <Box
          component="div"
          sx={{
            display: { xs: "none", sm: "flex" },
            flex: 3,
            justifyContent: "space-around",
          }}
        >
          {navItems.map((item) => (
            <Button size="large" key={item} sx={{ color: "#fff" }}>
              {item}
            </Button>
          ))}
        </Box>
        <Box
          component="div"
          sx={{
            display: { xs: "none", sm: "flex" },
            flex: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            component="div"
            sx={{ flex: "3", justifyContent: "end", display: "flex" }}
          >
            <SearchOutlined />
          </Box>
          <Box
            component="div"
            sx={{ flex: "1", justifyContent: "end", display: "flex" }}
          >
            <ShoppingCartOutlined />
          </Box>
          <Box
            component="div"
            sx={{ flex: "1", justifyContent: "end", display: "flex" }}
          >
            <PersonOutlineOutlined />
          </Box>
        </Box>

        <Box
          component="div"
          sx={{
            display: { sm: "none" },
          }}
        >
          <Hamburger />
        </Box>
      </Container>
    </header>
  );
};

export default MyAppBar;
