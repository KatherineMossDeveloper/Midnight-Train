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

## How to recreate the results.  



[back to top](#content)  

## The license.  
This project is licensed under the MIT License.  See the license.txt file for details [here](../LICENSE).  
[back to top](#content)  

## Contact info.                                                                     
For more details about this project, feel free to reach out to me at katherinemossdeveloper@gmail.com or my account on [LinkedIn](https://www.linkedin.com/pub/katherine-moss/3/b49/228) .  
My time zone is EST in the U.S.

[back to top](#content)  


#### Footnotes
> <sup id="f1">1</sup> The F1-score is an overall score of how well a model is learning.  It is the harmonic mean of precision and recall for each class.  A simple average, also known as an “arithmetic mean,” would be too crude a measure because it would simply “take an average” of the two numbers.  For example, if precision were 90% and recall were 20%, then the average would be 55, so you might think the model is working somewhat.
>
>                                        (90 + 20) / 2 = 55
>
> In reality, the imbalance between the two numbers is a problem, a problem not reflected if you calculated an arithmetic mean, which gives you 55 as the answer.  In contrast, using the same numbers, the harmonic mean would be ~32%, a better reflection of the trouble that the model is in.  Below is the formula for the harmonic mean.
>
>           F1=  (2 x precision x recall) / (precision + recall) = (2 x 90 x 20) / (90 + 20) ≅ 32
>
> For more about F1, visit [F1 on Wikipedia](https://en.wikipedia.org/wiki/F-score).  
> [⏎](#a1)  

> <sup id="f2">2</sup> Callbacks can be thought of as hooks into the model while it is training.  A typical callback is a class with an event function, like on_epoch_end.   Just like it sounds, when the model comes to the end of each epoch, it will call all callback classes, so that each class can do things, like collect metrics, write to the screen, make a decision about stopping the training, etc.  It gives the developer more information and control during training.
>
> Technically, in Keras, callbacks are classes because they inherit from the “Callback” mothership.  Therefore, you would instantiate a callback class, hand it to the model, which would then call the instantiation, not the class itself.
> 
> For more about callbacks, visit [callbacks on Keras.io](https://keras.io/api/callbacks/).  
> [⏎](#a2)

> <sup id="f3">3</sup>  kmeans clustering is an algorithm that can show us how data is grouped.  It does this ‘unsupervised,’ meaning that the data is not labeled.  It is surprising to learn that kmeans was first proposed in 1957, and yet it is still an important part of a data scientist’s toybox.  There is more than one kind of kmeans algorithm, but the most popular one, and the one used in sklearn, is “Lloyd”.   For more on this, I recommend Johannes Wohlenberg’s  great article on www.medium.com.  It has a cool animation that shows how kmeans centroids ‘find’ each group.   [kmeans on Medium](https://medium.com/data-science/three-versions-of-kmeans-cf939b65f4ea).  
> [⏎](#a3)

> <sup id="f4">4</sup>  The macro average is just what it sounds like, the average of precision, recall, or F1 scores for all classes, which for us is just PG and CEX.
>   
> Macro Avg Precision = Average of the precision values of both classes.  
> Macro Avg Recall = Average of the recall values of both classes.  
> Macro Avg F1-Score = Average of the F1-scores of both classes.  
>
> Here is an example from a training run.  
>
> PG           - Precision: 0.9591, Recall: 0.9993, F1-Score: 0.9788  
> CEX          - Precision: 0.9992, Recall: 0.9552, F1-Score: 0.9767  
> macro avg    - Precision: 0.9791, Recall: 0.9773, F1-Score: 0.9777  
> weighted avg - Precision: 0.9786, Recall: 0.9778, F1-Score: 0.9778  
>
> In contrast, the weighted average takes into account the number of samples in each class.  For us, the number of samples is about the same, but for another dataset, these numbers could be unequal, so these numbers could tell us more in that case.  
> 
> For more, visit [weighted average on Wikipedia](https://en.wikipedia.org/wiki/Weighted_arithmetic_mean).  
> [⏎](#a4)

> <sup id="f5">5</sup> Training accuracy is a measure, during the training epochs, of how well the model is learning the training data.
> 
> Validation accuracy is a measure, during the training, of how well the model can perform on validation data, meaning data that it has not been trained on.
> 
> Testing accuracy is a measure, after training, of how well the model can do predictions, or inference, on a data test set that it was not trained on, often deemed an “independent” dataset that is related to the other two sets, but not collected with it.
> 
> For more, visit [validation vs test vs training accuracy](https://www.geeksforgeeks.org/training-vs-testing-vs-validation-sets/).  
> [⏎](#a5)

> <sup id="f6">6</sup> A Confusion matrix is a commonly used deliverable in machine learning.  Rather than just looking at accuracy numbers, for example, this matrix
> can simply show you how many errors there were, and in which category.
>
> Since this project has been a binary classification effort, and the metrics were very good, the confusion matrix is simple, as seen below.  The X axis (the horizontal axis) is what the model decided, or predicted.  The Y axis (the vertical axis) is the “label,” or “truth.”  The squares are colorized.  The higher the number, the deeper the shade of blue. 
>
> ![Results](../images/results_confusion.png)  
> -The dark blue square on the upper left shows us the number of times, 343, that the model was shown PG crystals and recognized them.  
> -The dark blue square on the lower right shows us the number of times, 341, that the model was shown CEX crystals and recognized them.  
> -The other two squares show the number of errors.  
> 
> It is called a “confusion” matrix because it can show where a model was confused.  Since the numbers here are good, I could have named it the “Clarity Matrix.”
> 
> For more, visit [confusion matrix on Wikipedia](https://en.wikipedia.org/wiki/Confusion_matrix).  
> [⏎](#a6)
 
<sup id="f7">7</sup> 
Weaviate is an open-source vector database, available on GitHub.  I downloaded the GitHub zip file, installed it, then ran it in a Docker container on my Win 10 pc.  I found the setup fairly straightforward.  The code in python to control the database bears no resemblance to SQL code, but I still found that writing the WeaviateDatabase class was not bad.  

Generally, to use my code, you can start the database, then create a client object in weaviate_connect. Once connected, delete and create a schema in weaviate_delete_and_create_schema.  Later in the code, add 'records' to the database, one at a time, using weaviate_add_record.  Each record contains identifying information, plus a vector.  The database kindly handles the creation of an 'index' that calculates the proximity of one vector to the others in the same collection or 'table' automatically.  Then call the query function, weaviate_find_neighbors, to ask for the nearest vectors to a given vector.  

Weaviate seemed pretty accommodating, in that it did not expect me to set up a table with a data type that handles vectors, nor did it expect me to study its many similarity search algorithms and explicitly ask for my favorite.  It felt like the engineers at Weaviate know that developers are hoping to set up and use the database with minimum work, at least at the outset of a project.  
  
Here is the structure of GA_weaviatedatabase.py, which contains connections and CRUD functions.  

 class WeaviateDatabase
     def weaviate_connect(self)  weaviate-client version 3.24.2.
     def weaviate_available()
     def weaviate_delete_and_create_schema()
     def weaviate_truncate(self)
     def weaviate_add_record(self, filename, image_vector)
     def weaviate_find_neighbors(self, image_vector, limit)
     def weaviate_row_count(self)
     def weaviate_fetch_record()


For more on Weaviate, visit [Weaviate](https://weaviate.io/).  
For more on Weaviate on GitHub, visit [Weaviate on GitHub](https://github.com/weaviate/weaviate).  
[⏎](#a7)  

<sup id="f8">8</sup> 
Allow me to explain force-directed graphs (FDG) by comparing them with a 2D scatter plot.   

A scatter plot presents exact, fixed points in space. The space is cartesian, meaning that the X and Y coordinates line up with each point. The value of each point is understood by its position relative to these axes.  

A force-directed graph presents points, or nodes, in space that are not fixed. The space is not cartesian. The axes do not define the points. The value of each point is understood by its position relative to other points that it is connected to, by lines, or edges. The clusters remain generally cohesive because of the combination of attractive and repulsive values that simulation physical forces in the FDG algorithms, like balls floating in a pool.  

Since an FDG is less exacting that a scatter plot, you might ask what the value is. I would argue that since the points are unmoored, they are presented as an animation that the user can change in order to see more. The user can see not just the major relationships, but also the more tenuous ones, based on, for example, the thickness of the edges. The animation also is beautiful and engaging.  Aesthetics matter.  

For more on D3Blocks on GitHub, visit [D3Blocks](https://github.com/d3blocks/d3blocks).  
For more on force-directed graphs, visit [Force directed graph drawing](https://en.wikipedia.org/wiki/Force-directed_graph_drawing).  
[⏎](#a8)  


