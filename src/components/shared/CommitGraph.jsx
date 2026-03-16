import { useCallback, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const BRANCH_COLORS = {
    main: '#39ff14',
    feature: '#58a6ff',
    develop: '#bd93f9',
    hotfix: '#ff4d4d',
    release: '#f0c040',
};

function getBranchColor(branch) {
    return BRANCH_COLORS[branch] || BRANCH_COLORS.feature;
}

function buildRFNodes(graphNodes) {
    return graphNodes.map(n => ({
        id: n.id,
        position: { x: n.x, y: n.y },
        data: {
            label: (
                <div style={{ 
                    textAlign: 'center', 
                    fontFamily: 'Fira Code, monospace', 
                    fontSize: '0.68rem',
                    width: '100%',
                    padding: '4px',
                }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: '50%', margin: '0 auto 6px',
                        background: n.isHead ? '#58a6ff' : getBranchColor(n.branch),
                        boxShadow: n.isHead
                            ? '0 0 12px #58a6ff'
                            : `0 0 10px ${getBranchColor(n.branch)}`,
                        border: n.isMerge ? '2px dashed #fff' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#000', fontWeight: 700,
                    }}>
                        {n.label[0]}
                    </div>
                    <div style={{ 
                        color: n.isHead ? '#58a6ff' : '#fff',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        lineHeight: 1.2
                    }}>
                        {n.label}
                    </div>
                    {n.isHead && <div style={{ color: '#58a6ff', fontSize: '0.55rem', marginTop: '2px', fontWeight: 700 }}>HEAD</div>}
                    {n.branch && (
                        <div style={{ 
                            color: getBranchColor(n.branch), 
                            fontSize: '0.5rem',
                            marginTop: '2px',
                            opacity: 0.8
                        }}>
                            {n.branch}
                        </div>
                    )}
                </div>
            ),
        },
        style: {
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)',
            width: 100,
            cursor: 'grab' // Indentation and cursor for UX
        },
        draggable: true,
    }));
}

function buildRFEdges(graphEdges, graphNodes) {
    return graphEdges.map((e, i) => {
        const sourceNode = graphNodes.find(n => n.id === e.from);
        const color = sourceNode ? getBranchColor(sourceNode.branch) : '#39ff14';
        return {
            id: `e-${i}`,
            source: e.from,
            target: e.to,
            type: 'default', // Using bezier for a natural branching look
            animated: true,
            style: { 
                stroke: color, 
                strokeWidth: 3, 
                opacity: 0.6,
                filter: `drop-shadow(0 0 2px ${color})` // Subtle glow on edges
            },
            markerEnd: { 
                type: MarkerType.ArrowClosed, 
                color,
                width: 15,
                height: 15,
            },
        };
    });
}

export function CommitGraph({ graphData }) {
    const { nodes: gNodes, edges: gEdges } = graphData;
    const [nodes, setNodes, onNodesChange] = useNodesState(buildRFNodes(gNodes));
    const [edges, setEdges, onEdgesChange] = useEdgesState(buildRFEdges(gEdges, gNodes));

    useEffect(() => {
        setNodes(buildRFNodes(gNodes));
        setEdges(buildRFEdges(gEdges, gNodes));
    }, [graphData]);

    return (
        <div
            style={{
                height: '320px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid rgba(57,255,20,0.15)',
                background: 'rgba(1, 4, 9, 0.8)',
                backdropFilter: 'blur(8px)',
            }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                fitViewOptions={{ padding: 0.15 }} // Reduced padding to fill more space
                proOptions={{ hideAttribution: true }}
                nodesDraggable={true}
                zoomOnScroll={false}
                panOnDrag={true} // Allow panning for better exploration
            >
                <Background color="#1a2332" gap={20} />
                <Controls showInteractive={false} style={{ background: '#161b22', border: '1px solid #333' }} />
            </ReactFlow>
        </div>
    );
}

// Simpler static SVG graph for when no library needed
export function SimpleCommitGraph({ steps, activeStep = 0 }) {
    const graph = steps[activeStep] || steps[0];
    if (!graph) return null;

    return (
        <div style={{
            background: '#010409', border: '1px solid rgba(57,255,20,0.2)',
            borderRadius: '8px', padding: '1rem', minHeight: '160px',
            overflowX: 'auto',
        }}>
            <CommitGraph graphData={graph} />
        </div>
    );
}
