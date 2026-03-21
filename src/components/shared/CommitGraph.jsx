import { useCallback, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    MarkerType,
    Handle,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const BRANCH_COLORS = {
    main: '#39ff14',
    loginpage: '#58a6ff', 
    develop: '#bd93f9',
    hotfix: '#ff4d4d',
    release: '#f0c040',
};

function getBranchColor(branch) {
    return BRANCH_COLORS[branch] || BRANCH_COLORS.feature;
}

const CommitNode = ({ data }) => {
    return (
        <div style={{
            background: 'rgba(22, 27, 34, 0.8)',
            borderRadius: '8px',
            border: '1px solid rgba(57, 255, 20, 0.2)',
            padding: '10px',
            width: 110,
            textAlign: 'center',
            fontFamily: 'Fira Code, monospace',
            position: 'relative',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}>
            <Handle 
                type="target" 
                position={Position.Left} 
                style={{ background: 'var(--text-dim)', border: 'none', width: '6px', height: '6px' }} 
            />
            
            <div style={{ 
                width: 32, height: 32, borderRadius: '50%', margin: '0 auto 6px',
                background: getBranchColor(data.branch),
                boxShadow: data.isHead
                    ? `0 0 15px ${getBranchColor(data.branch)}`
                    : `0 0 10px ${getBranchColor(data.branch)}`,
                border: data.isMerge ? '2px dashed #fff' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#000', fontWeight: 700,
                fontSize: '0.8rem'
            }}>
                {data.label[0]}
            </div>

            <div style={{ 
                color: data.isHead ? '#58a6ff' : '#fff',
                fontSize: '0.68rem',
                lineHeight: 1.2
            }}>
                {data.label}
            </div>

            {data.isHead && (
                <div style={{ color: '#58a6ff', fontSize: '0.55rem', marginTop: '2px', fontWeight: 700 }}>
                    HEAD
                </div>
            )}
            
            {data.branch && (
                <div style={{ 
                    color: getBranchColor(data.branch), 
                    fontSize: '0.5rem',
                    marginTop: '2px',
                    opacity: 0.8
                }}>
                    {data.branch}
                </div>
            )}

            <Handle 
                type="source" 
                position={Position.Right} 
                style={{ background: 'var(--text-dim)', border: 'none', width: '6px', height: '6px' }} 
            />
        </div>
    );
};

const nodeTypes = {
    commit: CommitNode,
};

function buildRFNodes(graphNodes) {
    return graphNodes.map(n => ({
        id: n.id,
        type: 'commit',
        position: { x: n.x, y: n.y },
        data: {
            label: n.label,
            branch: n.branch,
            isHead: n.isHead,
            isMerge: n.isMerge,
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
            type: 'straight', // Straight lines as requested
            animated: true,
            style: { 
                stroke: color, 
                strokeWidth: 3, 
                opacity: 0.7,
                filter: `drop-shadow(0 0 4px ${color})` // Glow on edges
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

    // Refit view whenever graphData changes
    useEffect(() => {
        setNodes(buildRFNodes(gNodes));
        setEdges(buildRFEdges(gEdges, gNodes));
    }, [graphData, setNodes, setEdges]);

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
                key={JSON.stringify(gNodes.map(n => n.id))} // Force re-render/refit when node structure changes
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2, duration: 400 }}
                proOptions={{ hideAttribution: true }}
                nodesDraggable={true}
                zoomOnScroll={false}
                panOnDrag={true}
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
