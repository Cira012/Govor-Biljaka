import PropTypes from 'prop-types';

export const plantPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  scientificName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      location: PropTypes.string.isRequired,
      verified: PropTypes.bool,
      description: PropTypes.string,
      date: PropTypes.string
    })
  ),
  floweringSeason: PropTypes.string
});

export const locationPropType = PropTypes.shape({
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  location: PropTypes.string.isRequired,
  verified: PropTypes.bool,
  description: PropTypes.string,
  date: PropTypes.string
});
