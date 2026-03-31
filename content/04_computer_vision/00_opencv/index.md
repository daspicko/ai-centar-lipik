# OpenCV - Open Source Computer Vision Library

OpenCV (Open Source Computer Vision Library) je biblioteka otvorenog koda za računalni vid i strojno učenje. Izvorno ju je razvila tvrtka Intel, a kasnije su je podržavali Willow Garage i Itseez (koju je kasnije preuzeo Intel). OpenCV se široko koristi u aplikacijama računalnog vida u stvarnom vremenu i pruža sveobuhvatan skup alata za obradu slika, analizu videozapisa i strojno učenje.

```python
import cv2
```

## [Metode dostupne u OpenCV-u](https://docs.opencv.org/4.x/)

1. **[Učitavanje](https://docs.opencv.org/4.x/d4/da8/group__imgcodecs.html#gaffb68fce322c6e52841d7d9357b9ad2d) i [spremanje](https://docs.opencv.org/4.x/d4/da8/group__imgcodecs.html#gabbc7ef1aa2edfaa87772f1202d67e0ce) slika**

   ```python
   image = cv2.imread('image.jpg', cv2.IMREAD_COLOR)
   cv2.imwrite('output.png', image)
   ```

2. **[Prikazivanje](https://docs.opencv.org/4.x/d7/dfc/group__highgui.html#ga453d42fe4cb60e5723281a89973ee563) slika**

   ```python
   cv2.imshow('Image', image)
   cv2.waitKey(0)
   cv2.destroyAllWindows()
   ```
3. **dsa **



20. **[Histogram](https://docs.opencv.org/4.x/d6/dc7/group__imgproc__hist.html#ga4b2b5fd75503ff9e6844cc4dcdaed35d) i [ekvalizacija](https://docs.opencv.org/4.x/d6/dc7/group__imgproc__hist.html#ga7e54091f0c937d49bf84152a16f76d6e)**

   ```python
   gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
   equalized_image = cv2.equalizeHist(gray_image)
   ```
