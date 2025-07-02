import { useEffect, useState } from "react";
import {
    Typography,
    Button,
    Box,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { fetchPackages } from "../api/ServiceApi";
import type { SubService } from "./ServicesAncCart";
import { packages as packagesBg } from "../assets";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface PackageItem {
    _id: string;
    packageName: string;
    packageDetail: string;
    packagePriceId: string;
    packageImageWeb?: string;
    column1?: string;
    column2?: string;
    column3?: string;
    column4?: string;
}

interface Props {
    onAddToCart: (item: SubService) => void;
    isAuthenticated?: boolean;
    setShowLoginInHero?: (val: boolean) => void;
    heroRef?: React.RefObject<HTMLDivElement>;
}

const PackageSection = ({ onAddToCart }: Props) => {
    const [packages, setPackages] = useState<PackageItem[]>([]);

    useEffect(() => {
        fetchPackages()
            .then((data) => setPackages(data))
            .catch((err) => console.error("Failed to fetch packages", err));
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <Box
            sx={{
                px: { xs: 2, md: 10 },
                py: 8,
                backgroundImage: `linear-gradient(rgba(13, 43, 71, 0.6), rgba(14, 45, 81, 0.61)), url(${packagesBg})`,
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <Typography variant="h3" align="center" color="#fff" fontWeight={600} gutterBottom>
                Subscription Package
            </Typography>
            <Typography align="center" variant="h6" color="#fff" mb={5}>
                Choose the plan that suits your needs. We offer flexible options for all spaces.
            </Typography>
            <Slider {...settings}>
                {packages.map((pkg) => {
                    const features = [pkg.column1, pkg.column2, pkg.column3, pkg.column4].filter(Boolean) as string[];

                    return (
                        <Box key={pkg._id} px={1} display="flex" height="100%">
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    width: "100%",
                                    textAlign: "center",
                                    bgcolor: "#fff",
                                    color: "#3E3E63",
                                    borderRadius: 2,
                                    height: 440, // Fixed height
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                    "&:hover": {
                                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                                    },
                                }}
                            >
                                {/* Top Content */}
                                <Box>
                                    <Typography
                                        fontSize={20}
                                        fontWeight="bold"
                                        color="#3E3E63"
                                    >
                                        {pkg.packageName}
                                    </Typography>

                                    <Typography variant="h4" fontWeight="bold" color="#3E3E63" mt={1}>
                                        ₹999 <span style={{ fontSize: "14px" }}>/ Month</span>
                                    </Typography>

                                    <List
                                        className="h-64 overflow-y-auto scrollbar-hide-hover hover:scrollbar-show transition-all duration-300"
                                        sx={{
                                            mt: 1,
                                            maxHeight: 220,
                                            overflowY: "auto",
                                            pr: 1,
                                        }}
                                    >
                                        {features.map((f, i) => (
                                            <ListItem key={i} disableGutters>
                                                <ListItemIcon sx={{ minWidth: 30, color: "#3E3E63" }}>
                                                    <CheckIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={f} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>

                                {/* Bottom Add Button */}
                                <Box mt="auto" pt={2}>
                                    <Button
                                        fullWidth
                                        onClick={() =>
                                            onAddToCart({ _id: pkg._id, name: pkg.packageName, price: 999 })
                                        }
                                        variant="contained"
                                        sx={{
                                            bgcolor: "#0BDA51",
                                            color: "#000",
                                            fontWeight: "bold",
                                            "&:hover": { bgcolor: "#09c44a" },
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>
                    );
                })}
            </Slider>

        </Box>
    );
};

export default PackageSection;
