package com.prodcons.server.Controllers;
import java.util.regex.Pattern;

import com.prodcons.server.graph.*;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class RequestsController {
    Graph graph = new Graph();

    //using Regex to check if the weights of the edges are numbers or variables
    /*the numbers grammar "-?\\d+(\\.\\d+)?":
        "-?"         -> negative sign is optional
        "\\d+"       -> one or more digits
        "(\\.\\d+)?" -> fraction part is optional
    */
    private Pattern pattern = Pattern.compile("-?\\d+(\\.\\d+)?");
    public boolean isNumeric(String strNum) {
        if (strNum == null) {
            return false; 
        }
        return pattern.matcher(strNum).matches();
    }
    /**************************************************
     * Craeation Graph requests                       *
     **************************************************/
    //adding a node request
    @PostMapping("/+node")
    public boolean add_node(){
        try{
            // this.graph.addNode();
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //adding an edge request
    //for example: "/+edge/x1/x2/40" adds an edge from (x1) to (x2) with weight 40
    @PostMapping("/+edge/{from}/{to}/{weight}")
    public boolean add_edge(
        @PathVariable("from") String from,
        @PathVariable("to") String to,
        @PathVariable("weight") String weight)

    {
        String str = "";
        try{
            if(isNumeric(weight)){ //Numeric weights
                // str = graph.addEdge(from, to, Double.valueOf(weight));
            }
            else{ //variable weights
                // str = graph.addEdge(from, to, weight);
            }
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        if(str.equalsIgnoreCase("success"))
        {
            return true;
        }
        else
            return false;
    }

    //clear the whole graph to draw another one
    @DeleteMapping("/clear")
    public boolean clearGraph(){
        try{
            this.graph = new Graph();
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }


    /**************************************************
     * Solution requests                              *
     **************************************************/
    //checks if it's a valid Signal-Flow-Graph or not 
    @PostMapping("/validate")
    public boolean validate(){
        return /* this.graph.valdiateGraph() */ true;
    }
    
    //solves & stores the solution
    @PostMapping("/solve")
    public void solve(){
        // this.graph.solve();
    }

    /* @PostMapping("/save")
    public void save(@RequestParam("shape") String shapes)
    {
        this.graph.setShapes(shapes);
    }
    @PostMapping("/load")
    public String load()
    {
        try{
        this.graph=cTaker.getMemento().getState();
        }
        catch(IndexOutOfBoundsException e)
        {
            System.out.println("no available replay");
            
        }
        String content = this.graph.getShapes();
        if(content == null)
        {
            return "";
        }
        return content;
    }
    @PostMapping("/replay")
    public void replay(){
        this.graph.replay();
    } */
}
