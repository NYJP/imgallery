import flask
import json, os
from flask import render_template, request

app = flask.Flask(__name__)

#Main page
@app.route("/", methods=['POST','GET']) 
#GET when the page is first loaded, or when using a 'back' button from other pages, and POST when form data is provided, only when deleteing an album
def mainroot():
  if os.path.exists("data.json"):
    with open("data.json") as datafile:
      data = json.load(datafile)
  else:
    data = {}

  if request.method == "POST":
    #What to do when deleting an album
    if request.form['tobedel'] in data:
      deleted = data.pop(request.form['tobedel'])
      #Pop selected album from the data dictionary
      if os.path.exists("data.json"): os.remove("data.json") #helps to refresh the data file faster 
      with open("data.json", "w") as datafile:
        json.dump(data,datafile)
  return render_template("index.html", data = data)

#Editing of album page
@app.route("/edit", methods=['POST'])
def editroot():
  if os.path.exists("data.json"):
    with open("data.json") as datafile:
      data = json.load(datafile)
  else:
      data = {}

  if request.form['title'] not in data:
    #What to do if its a request for a new album
    data[request.form['title']] = {'title':request.form['title'], 'no_images':0, 'styles':{"titlesize": "30", "captionsize": "20", "layout": "one column", "titlecolour": "0,0,0", "backgroundcolour": "none", "imagebordercolour": "none", "captionbackgroundcolour": "none", "captionfontcolour": "0,0,0", "captionbordercolour": "none"}}
    #Creates the default settings for style (black title, black captions, everything else white)
    
    if os.path.exists("data.json"): os.remove("data.json") #helps to refresh the data file faster 
    with open("data.json", "w") as datafile:
      json.dump(data,datafile)

  return render_template("edit.html",title = request.form['title'], data = data[request.form['title']])

#Viewing album page
@app.route("/view", methods=['POST'])
def viewroot():
  if os.path.exists("data.json"):
    with open("data.json") as datafile:
      data = json.load(datafile)
  else:
      data = {}

  #Checks for view method, whether it be direct access from mainpage, or access after editing from the edit page)
  if len(request.form) > 1:
    #Request is from edit page, data needs to be updated
    if request.form['title'] in data: #Ensure album exists
      data[request.form['title']] = transdata(request.form)
      
      if os.path.exists("data.json"): os.remove("data.json") #helps to refresh the data file faster 
      with open("data.json", "w") as datafile:
        json.dump(data,datafile)
    
      return render_template("view.html",title = request.form['title'], data = data[request.form['title']])
    else: return render_template("error.html")
    
  else:
    #Request is from mainpage, should directly load album
    if request.form['tobeview'] in data: #Ensure album exists
      return render_template("view.html",title = request.form['tobeview'], data = data[request.form['tobeview']])
    else: return render_template("error.html")

#Translate edit page form data into proper dictionary format, through simplifying keys and sorting by identifiers
def transdata(form):
  caps = []
  urls = []
  styles = {}
  for i in form:
    #Seperate data by differnt identifiers
    if i[:7] == 'caption': caps.append(form[i]) 
    #Since all caption input elements are labled as caption1, caption2, caption3...
    elif i[:5] == 'image': urls.append(form[i])
    #Since all image url (text form) input elements are labled as image1, image2, image3...
    elif i[:5] == 'style': styles[i[5:]] = form[i]
    #Since all style related input elements have 'style' placed in front of their identifiers
  return {'title':form['title'],'no_images':int(form['no_images']),'captions':caps,'images':urls,'styles':styles}

#Error management
@app.errorhandler(404)
def not_found(e):
  return render_template("error.html")

app.run(host="0.0.0.0", port=8080, debug=True)

