import React from 'react';
import { Box, Typography,  useTheme, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Slider from 'react-slick';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Devices as DevicesIcon,
  HourglassEmpty as HourglassEmptyIcon,
  ViewList as ViewListIcon,
  Code as CodeIcon,
  Cached as CachedIcon,
  Api as ApiIcon,
} from '@mui/icons-material';
import { infos } from '@/app/api/info';

const iconMapping = {
  Search: <SearchIcon sx={{ fontSize: { xs: '6rem', md: '8rem' }, color: '#fff' }} />,
  FilterList: <FilterListIcon sx={{ fontSize: { xs: '6rem', md: '8rem' }, color: '#fff' }} />,
  Devices: <DevicesIcon sx={{ fontSize: { xs: '6rem', md: '8rem' }, color: '#fff' }} />,
  HourglassEmpty: <HourglassEmptyIcon sx={{ fontSize: { xs: '6rem', md: '8rem' }, color: '#fff' }} />,
  ViewList: <ViewListIcon sx={{ fontSize: { xs: '6rem', md: '8rem' }, color: '#fff' }} />,
  Code: <CodeIcon sx={{ fontSize: { xs: '6rem', md: '8rem' }, color: '#fff' }} />,
  Cached: <CachedIcon sx={{ fontSize: { xs: '6rem', md: '8rem' }, color: '#fff' }} />,
  Api: <ApiIcon sx={{ fontSize: { xs: '6rem', md: '8rem' }, color: '#fff' }} />,
};

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: false,
};

function CarouselExample() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{  mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Slider {...settings}>
        {infos.map((info, index) => (
          <Box
            key={index}
            sx={{
              p: { xs: 2, md: 4 },
              bgcolor: '#D23F57',
              borderRadius: '16px',
              width: '100%',
              minHeight: '300px',
            }}
          >
            <Grid
              container
              alignItems="center"
              spacing={2}
              sx={{
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              {/* Left Side - Text */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant={isMobile ? 'h5' : 'h4'}
                  sx={{ color: '#fff', fontWeight: 'bold' }}
                >
                  {info.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: '#fff', mt: 2 }}
                >
                  {info.quote}
                </Typography>
              </Grid>
              {/* Right Side - Icon */}
              <Grid
                size={{ xs: 12, md: 6 }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: { xs: 2, md: 0 },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    width: { xs: '200px', md: '300px' },
                    height: { xs: '200px', md: '300px' },
                    p: 2,
                  }}
                >
                  {iconMapping[info.icon]}
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}

export default CarouselExample;