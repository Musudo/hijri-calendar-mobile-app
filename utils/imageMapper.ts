import { ImageSourcePropType } from 'react-native';

export type ImageKey =
  | 'image1'
  | 'image2'
  | 'image3'
  | 'image4'
  | 'image5'
  | 'image6'
  | 'image7'
  | 'image8'
  | 'image9'
  | 'image10'
  | 'image11';

export type ImageMapper = {
  [key in ImageKey]: ImageSourcePropType;
};

export const imageMapper: ImageMapper = {
  image1: require('../assets/images/image 1.jpg'),
  image2: require('../assets/images/image 2.jpeg'),
  image3: require('../assets/images/image 3.jpeg'),
  image4: require('../assets/images/image 4.jpeg'),
  image5: require('../assets/images/image 5.jpeg'),
  image6: require('../assets/images/image 6.jpeg'),
  image7: require('../assets/images/image 7.jpeg'),
  image8: require('../assets/images/image 8.jpg'),
  image9: require('../assets/images/image 9.jpg'),
  image10: require('../assets/images/image 10.jpg'),
  image11: require('../assets/images/image 11.jpg'),
};
