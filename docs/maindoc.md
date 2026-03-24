![Hero](../images/HeroPolaroidsSmall.png)  

## Content.
<a href="#the-overview">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> The overview.
</a><br>
<a href="#d3">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> D3.js
</a><br>
<a href="#cam-overlays">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> CAM overlays
</a><br>
<a href="#accordion">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> The D3.js Accordion
</a><br>
<a href="#cam-accordion">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> -->Screen tool:  CAM overlays + the D3.js Accordion
</a><br>
<a href="#cam-slider">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> -->Screen tool:  CAM image slider
</a><br>  
<a href="#feature-vectors">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Feature vectors
</a><br>
<a href="#Feature-vector-database">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Feature vectors + Weaviate database
</a><br>
<a href="#pca">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Principal component analysis
</a><br>
<a href="#kmeans">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Kmeans
</a><br>
<a href="#pca-kmeans">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> -->Screen tool:  PCA + Kmeans scatter plot of feature vectors 
</a><br>
<a href="#force-directed-graph">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Force directed graphs
</a><br>

<a href="#hnsw">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> HNSW nearest neighbor algorithm 
</a><br>
<a href="#force-directed-graph-kmeans">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> -->Screen tool:  Force directed graphs + HNSW + Kmeans
</a><br>
<a href="#histograms-entropy">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Histograms and Entropy
</a><br>
<a href="#histogram-notes">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> -->Screen tool:  Histogram
</a><br>
<a href="#entropy-kmeans">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> -->Screen tool:  Entropy scatter plots + Kmeans
</a><br>
<a href="#react-tailwind">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/>  React + Tailwind
</a><br>

<a href="#pseudo-3d">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Appendix A:  Pseudo 3D A.I. hallucination of structural relief
</a><br>
<a href="#pca-3d">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Appendix B:  PCA in 3D 
</a><br>
<a href="#entropy">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Appendix C:  Entropy
</a><br>
<a href="#flow">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Appendix D:  Flow of the code
</a><br>
<a href="#hnsw-notes">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Appendix E:  HNSW
</a><br>
<a href="#image-slider-notes">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Appendix F:  The Image Slider
</a><br>
<a href="#log">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Appendix G:  The Log
</a><br>
<a href="#cam-generation">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Appendix H:  The CAM overlay generation process 
</a><br>
<a href="#quick-start">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Appendix I:  Quick start instructions
</a><br>
<a href="#weaviate-notes">
  <img src="../images/HeroSmall.png" alt="icon" style="vertical-align: middle; width: 20px; height: 20px;"/> Appendix J:  Weaviate
</a><br>


## The overview
I am a software developer doing an independent study into using machine learning to identify crystallization in images. I found an interesting dataset and a really good research paper on the topic, so I wrote code to train on the data, and presented the data, using the paper for guidance. I am posting the code and results here in the hope that others will also find it interesting.

I found the crystal image dataset on Kaggle. I decided to work with it because there were enough images to train with, and the images are all high quality. Here is the hyperlink to the dataset: OpenCrystalData Crystal Impurity Detection.

The dataset I found was collected using Mettler-Toledo, LLC, (MT) instrumentation. While this is not a research paper, where one would typically make an affiliation statement, I should mention that I worked at MT on their vision products for years. However, I am no longer affiliated with the Company and am not necessarily endorsing their products here, nor have I used any intellectual property owned by MT.

I chose crystallization in images because I think it is an important area of A.I. Other corners of the A.I. world, like LLM’s, video creation, and robotics, have grabbed headlines these days, but I would argue that the detection and categorization of crystallization in images is just as important because it is used in food processing, drug discovery, quality control in manufacturing, etc. It would be good to have more developers and data scientists interested in this part of A.I.

In the KatherineMossDeveloper GitHub website, there are two related projects, the Georgia Project and Midnight Train. 

The Georgia Project was inspired by a research paper:  Salami, H., McDonald, M. A., Bommarius, A. S., Rousseau, R. W., & Grover, M. A. (2021). In Situ Imaging Combined with Deep Learning for Crystallization Process Monitoring: Application to Cephalexin Production. Organic Process Research & Development, 25, 1670–1679.

The scientists who wrote the paper trained ResNet models with ImageNet weights on the OpenCrystalData dataset. The models were trained to do binary classification of images of crystals, designating them as either CEX (a.k.a., “cephalexin antibiotic,” a good thing) or PG (a.k.a. “phenylglycine,” a bad thing).  One purpose of the paper was to determine if an impurity, PG, shows up during cephalexin antibiotic production. This would allow scientists to stop the process early, saving time and resources. This is the task that the A.I. model addresses.

The Georgia Project recreates their work, then it stores details in a database.  Midnight train, in turn, pulls these details from the database and creates graphs in order to study the dataset. 

<a href="#">
  <img src="../images/overview.png" alt="Overview" style="vertical-align: middle; width: 1022px; height: 387px;"/>
</a><br>
Overview of the Georgia Project and Midnight Train.  (image by author)

The goals for Midnight Train are to explore visualization with React in general and D3.js in particular.  I also wanted to see how the output from a trained model would benefit from support from a vector database.  

[back to top](#content)   

## D3
D3.js is a free and open-source JavaScript visualization library that presents data in ways that are attractive, unusual, and often animated.  Midnight train has a number of interactive screen components that either use the D3.js library or are inspired by the D3.js visualization.  These include a force directed graph, scatter plot animation, a histogram, and an “accordion” view of images.  

By the way, I ran across the D3.js library years ago, so I am surprised to see that its popularity is escalating, as this graph of daily downloads suggests.  

<a href="#">
  <img src="../images/d3downloads.png" alt="Overview" style="vertical-align: middle; width: 1257px; height: 458px;"/>
</a><br>
(Image credit:  Mike Bostock) 

For more on D3.js, visit D3 by Observable, visit [D3](https://d3js.org/).  

For more on D3 on GitHub, visit [D3](https://github.com/d3/d3?tab=readme-ov-file).  

For more on the creator of D3.js, visit [Mick Bostock](https://bost.ocks.org/mike/).  

[back to top](#content)   

## CAM overlays
This method, known usually by it initials “CAM,” is a way to show where a trained A.I. model gave the most weight to the features in an image when classifying the image.  Here is a nice clear example from the Johannes Schusterbauer blog, using an image of a meer kat as an example.  The model was tasked with classifying the image as being of a meer kat or not.  

The image on the left is the original photo.  The image on the right is the CAM overlay, which shows the weights applied by the A.I. model as colors over the original image.  The red areas had the highest weights.  The purple areas had the lowest weights.  

We know from the CAM overlay that the model was “looking” in the right areas when making a classification.  The red colors are over the animal, instead of mistakenly over the background, for example.  Going further, we know that it was looking more at the neck than the eyes when classifying this as an image of a meer kat.  

<a href="#">
  <img src="../images/cammeerkat.png" alt="Overview" style="vertical-align: middle; width:  800px; height: 300px;"/>
</a><br>
Image credit: [Schusterbauer](https://johfischer.com/2022/01/27/class-activation-maps/).  

I wanted to apply this technique to the OpenCrystalData dataset.  In my first attempts, I used the traditional “rainbow” color scheme, as seen above with the meer kat.  The OpenCrystalData dataset images with these CAM overlays were aesthetically pleasing, but too visually complex to tie the colorization back to crystal structures, or the classification, which were the goals -- assuming that these goals could be achieved.  Here is an example image of my first attempt. 

<a href="#">
  <img src="../images/camcrystal.png" alt="Overview" style="vertical-align: middle; width:  300px; height: 300px;"/>
</a><br>

CEX (6819).png with rainbow color scheme and showing all colorization (weight threshold > 0) (Image by author) 

After several attempts, I decided to not use the typical rainbow color scheme, but simplify the colorization down to one or two colors.  When choosing the colors, pink and purple seemed more pleasing, probably because they reminded me of H&E staining, however irrelevant that is.  I also set up a threshold, so that only the areas with the highest weights would have the overlay colors applied, rather than have the whole image covered with color.  Here is an example using the same image, CEX (6819).png.  The original is on the left.  The original with the pink and purple CAM overlay applied is on the right.  For more, see Appendix H:  The CAM overlay generation process. 

<a href="#">
  <img src="../images/cammidnighttrain.png" alt="Overview" style="vertical-align: middle; width:  600px; height: 300px;"/>
</a><br>
(Image by author) 

[back to top](#content)   

## accordion
The D3.js accordion 
Some years ago, I found an interactive visualization online in the The New York Times called “Front Row to Fashion”.  The technology was D3.js.  I was impressed that this ‘accordion’ style of visualization, on the one hand, showed partial images of clothing, and yet imparted new information about the collection.  Specifically, one could see the overall style of a designer, rather than focus on the individual pieces; i.e. one can see the forest, rather than the trees.  Here is an example using six of those collections.  
<a href="#">
  <img src="../images/d3frontrow.png" alt="CEX samples" style="vertical-align: middle; width: 923px; height: 400px;"/>
</a><br>
Image credit: [NYT](https://www.nytimes.com/newsgraphics/2014/02/14/fashion-week-editors-picks/index.html).  
[back to top](#content)   

## cam accordion
Screen tool:  CAM overlays + the D3.js accordion 
So, how could scientific visualization benefit from this idea?  As a developer, I saw an opportunity here, so I put two accordion style visualizations in Midnight Train, as seen below.  The images are of the CAM overlays.  The top one is of CEX images, and the bottom is of PG images.  The pink and purple areas are where the model mostly “focused on” when doing classification of the images.  The accordions are animated.  A mouse hover opens each image fully.  Note that when you look at these partial images, the pink overlays are more uniform in the CEX images, and the background of the PG images is noisier.  We can see the forest. 
<a href="#">
  <img src="../images/accordionsmidnighttrain.png" alt="CEX samples" style="vertical-align: middle; width: 500px; height: 600px;"/>
</a><br>
The accordion screen controls in Midnight Train (image by author). 
[back to top](#content)  

## cam slider
Screen tool:  CAM Image slider
The CAM image slider, as seen below, shows both the original image and CAM overlay image together.  Instead of being side-by-side, they both take up the space of one image, with a click and drag functionality.  The user can drag the bar to the right and left to study where the CAM overlay is placed.  

<a href="#">
  <img src="../images/camslider.png" alt="CEX samples" style="vertical-align: middle; width: 500px; height: 400px;"/>
</a><br>
The CAM Image Slider (image by author)  
[back to top](#content)  

## feature vectors
Feature vectors
As mentioned elsewhere, the Georgia Project produced many pieces of information after training on the OpenCrystalData dataset.  This included metadata, of course, like the confidence percent that the model had when determining the classification of an image.  However, the most important data was perhaps not the meta data, but the feature vectors that the model created in order to make the classification.  Feature vectors contain numerical weights calculated by the model.  Different layers of the model create weights for larger and larger areas of a given image.  Here is a visualization of these weights when a model was creating feature vectors for images of human faces.  

<a href="#">
  <img src="../images/featurevectorsizes.png" alt="CEX samples" style="vertical-align: middle; width: 800px; height: 300px;"/>
</a><br>
Image credit: [CNN](https://www.grammarly.com/blog/ai/what-is-a-convolutional-neural-network/).  
[back to top](#content)  

## Feature vector database
Feature vectors + Weaviate database 
Storing such a vector, with many dimensions, is not a typical storage consideration for a relational database.  A typical SQL database does not have a vector datatype.   This led me to vector databases.  My plan was that such a database would allow me to bridge the gap between the Georgia Project, which produced data, and the Midnight Train Project, which presents data.  Hence, the pun about “Midnight Train to Georgia.” 

For more on Weaviate, visit [Weaviate](https://weaviate.io/).  
For more on the song, visit [Midnight Train to Georgia](https://en.wikipedia.org/wiki/Midnight_Train_to_Georgia).  
[back to top](#content)  

## The license.  
This project is licensed under the MIT License.  See the license.txt file for details [here](../LICENSE).  
[back to top](#content)  

## Contact info.                                                                     
For more details about this project, feel free to reach out to me at katherinemossdeveloper@gmail.com or my account on [LinkedIn](https://www.linkedin.com/pub/katherine-moss/3/b49/228) .  
My time zone is EST in the U.S.

[back to top](#content)  


