package com.prodcons.server.Controllers;
import java.util.regex.Pattern;

import com.prodcons.server.graph.*;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class RequestsController {
    Graph SFG = new Graph();

    //using Regex to check if the weights of the edges are numbers or not
    /*the numbers grammar "-?\\d+(\\.\\d+)?":
        "-?"         -> negative sign is optional
        "\\d+"       -> one or more digits
        "(\\.\\d+)?" -> fraction part is optional
    */
    private Pattern pattern = Pattern.compile("-?\\d+(\\.\\d+)?");
    //checks if the given string is a number or not
    public boolean isNumeric(String strNum) {
        if (strNum == null) {
            return false; 
        }
        return pattern.matcher(strNum).matches();
    }


    /****************************************************************
     * Craeation Graph requests                                     *
     ****************************************************************/
    //adding a node - post request
    @PostMapping("/+node/{name}")
    public boolean add_node(@PathVariable("name") String name){
        try{
            this.SFG.addVertex(name);
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //sets the input node
    @PostMapping("/input-node/{name}")
    public boolean set_input_node(@PathVariable("name") String name){
        try{
            this.SFG.setStartVertex(name);
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //sets the output node
    @PostMapping("/output-node/{name}")
    public boolean set_output_node(@PathVariable("name") String name){
        try{
            this.SFG.setEndVertex(name);
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //adding an edge - post request
    @PostMapping("/+edge/{from}/{to}")
    public boolean add_edge(
        @PathVariable("from") String from,
        @PathVariable("to") String to)

    {
        try{
            this.SFG.addEdge(from, to);
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //adding an edge with weight - post request
    @PostMapping("/+edge+weight/{from}/{to}/{weight}")
    public boolean add_edge_and_weight(
        @PathVariable("from") String from,
        @PathVariable("to") String to,
        @PathVariable("weight") String weight)

    {
        try{
            if(isNumeric(weight)){ //Numeric weights
                this.SFG.addEdge(from, to, Double.valueOf(weight));
            }
            else{ //variable weights
                // this.SFG.addEdge(from, to, weight);
            }
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //setting/updating an edge weight - post request
    @PostMapping("/set-edge-weight/{from}/{to}/{new_weight}")
    public boolean set_edge_weight(
        @PathVariable("from") String from,
        @PathVariable("to") String to,
        @PathVariable("new_weight") String new_weight)

    {
        try{
            if(isNumeric(new_weight)){ //Numeric weights
                this.SFG.setEdgeWeight(from, to, Double.valueOf(new_weight));
            }
            else{ //variable weights
                // this.SFG.setEdgeWeight(from, to, new_weight);
            }
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }


    //clear the whole graph to draw another one - delete request
    @DeleteMapping("/clear")
    public boolean clearGraph(){
        try{
            this.SFG = new Graph();
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }


    /****************************************************************
     * Solution requests                                            *
     ****************************************************************/
    //checks if it's a valid Signal-Flow-Graph or not 
    @PostMapping("/validate")
    public boolean validate(){
        return /* this.SFG.valdiateGraph() */ true;
    }
    
   /*  
    //solves & stores the solution
    @PostMapping("/solve")
    public void solve(){
        //solving the signal flow graph
    }
 */
    //forward paths get request
    @GetMapping("/solve/forward-paths")
    public String get_forward_paths(){
        try{
            return this.SFG.getPaths();
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }

    //loops get request
    @GetMapping("/solve/loops")
    public String get_loops(){
        try{
            return this.SFG.getAllLoops();
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }

    //Non touching loops get request
    @GetMapping("/solve/non-touching-loops")
    public String get_non_touching_loops(){
        try{
            return this.SFG.getLoopsClassified();
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }

    //determinants get request
    @GetMapping("/solve/paths-determinants")
    public String get_paths_determinants(){
        try{
            return this.SFG.calculatePathFactors();
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }

    //determinant get request
    @GetMapping("/solve/determinant")
    public String get_determinant(){
        try{
            return this.SFG.calculateDeterminant();
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }

    //Overall gain (the result) get request
    @GetMapping("/solve/overall-gain")
    public String get_overall_gain(){
        try{
            return this.SFG.getOverallGain();
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }
}
