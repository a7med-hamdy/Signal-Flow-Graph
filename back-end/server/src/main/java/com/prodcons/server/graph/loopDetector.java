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
    public List<List<String>> getLoops()
    {
        return this.detector.findSimpleCycles();
    }

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
            Set<Set<Integer>> set = Sets.combinations(Sets.newHashSet(indices), i);
            for(Set<Integer> q: set)
            {
                List<List<String>> x = new ArrayList<>();
                for(int index : q)
                {
                    x.add(allLoops.get(index));
                }
                boolean flag = true;
                List<List<String>> list = Lists.cartesianProduct(Lists.newArrayList(x));
                for(List<String> y : list)
                {
                    if(!this.isNonTouching(y))
                    {
                        flag = false;
                    }
                }
                if(flag)
                {
                    answer.add(Lists.newArrayList(x));
                }
            }
        }
        return answer;
    }
    private boolean isNonTouching(List<String> list)
    {
        return list.stream().distinct().count() == list.size();
    }
}
