package com.prodcons.server.graph;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;


import org.jgrapht.alg.cycle.HawickJamesSimpleCycles;
import org.jgrapht.graph.DirectedWeightedPseudograph;
import org.jgrapht.graph.DefaultWeightedEdge;
import com.google.common.collect.*;

public class loopDetector {
    private DirectedWeightedPseudograph<String, DefaultWeightedEdge> graph;
    HawickJamesSimpleCycles<String, DefaultWeightedEdge> detector;
    public loopDetector(DirectedWeightedPseudograph<String, DefaultWeightedEdge> graph)
    {
        this.graph = graph;
        this.detector = new HawickJamesSimpleCycles<>(graph);
    }
    //use the Hawick James algorithm to find the cycles
    public List<List<String>> getLoops()
    {
        return this.detector.findSimpleCycles();
    }
    // get the non-touching loops
    public List<List<List<String>>> getNonTouchingLoops()
    {
        List<List<List<String>>> answer = new ArrayList<>();
        List<List<String>> allLoops = this.detector.findSimpleCycles();
        int w = 0;
        ArrayList<Integer> indices = new ArrayList<>();
        for(List<String> l : allLoops){
            List<List<String >> list = new ArrayList<>();
            list.add(l);
            answer.add(list);
            indices.add(w);
            w++;
        }
        for(int i = 2; i <= indices.size(); i++)
        {
            //get combinations from the indices of the loops
            Set<Set<Integer>> set = Sets.combinations(Sets.newHashSet(indices), i);
            for(Set<Integer> q: set)
            {
                //create a set of loops using the indices combinations
                List<List<String>> x = new ArrayList<>();
                for(int index : q)
                {
                    x.add(allLoops.get(index));
                }
                boolean flag = true;
                // apply cartesian product on each list of loops
                List<List<String>> list = Lists.cartesianProduct(x);
                for(List<String> y : list)
                {
                    // if no symbols are repeated then they are non touching
                    if(!this.isNonTouching(y))
                    {
                        flag = false;
                    }
                }
                if(flag)
                {
                    answer.add(x);
                }
            }
        }
        return answer;
    }
    // helper method to detect if there is a repeated node in a given path or loop
    private boolean isNonTouching(List<String> list)
    {
        return list.stream().distinct().count() == list.size();
    }
}
