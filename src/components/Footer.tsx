import { Box, Typography, Container, IconButton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const navLinkStyles = {
  textDecoration: "none",
  color: "#3E3E63",
  fontWeight: 500,
  fontSize: "14px",
  "&:hover": {
    color: "#0BDA51",
  },
};

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        color: "#3E3E63",
        pt: 6,
        pb: 3,
        borderTop: "1px solid #ddd",
      }}
    >
      <Container maxWidth="lg">
        {/* Logo */}
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ letterSpacing: 2 }}
        >
          CLICK N CLEAN
        </Typography>

        {/* Nav Links */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 5,
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography component={RouterLink} to="/about" sx={navLinkStyles}>
            About Us
          </Typography>
          <Typography component={RouterLink} to="/terms" sx={navLinkStyles}>
            Terms & Conditions
          </Typography>
          <Typography component={RouterLink} to="/privacy-policy" sx={navLinkStyles}>
            Privacy Policy
          </Typography>
          <Typography component={RouterLink} to="/faq" sx={navLinkStyles}>
            FAQs
          </Typography>
          <Typography component={RouterLink} to="/feedback" sx={navLinkStyles}>
            Feedback
          </Typography>
        </Box>

        {/* Social Icons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
          <IconButton sx={{ color: "#3b5998" }}>
            <FacebookIcon />
          </IconButton>
          <IconButton sx={{ color: "#E1306C" }}>
            <InstagramIcon />
          </IconButton>
          <IconButton sx={{ color: "#1DA1F2" }}>
            <TwitterIcon />
          </IconButton>
        </Box>

        {/* Copyright */}
        <Box
          mt={3}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, md: 6 },
            py: 2,
            borderTop: "1px solid #ddd",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Copyright © 2025 Click n Clean
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Designed by: Fistreet Systems Pvt. Ltd.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
