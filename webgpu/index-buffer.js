async function main() {
  // 获取适配器
  const adapter = await navigator.gpu?.requestAdapter();
  const device = await adapter?.requestDevice();
  if (!device) {
    alert('need a browser that supports WebGPU');
    return;
  }

  const canvas = document.querySelector('canvas');
  // 获取设备的 DPR
  const dpr = window.devicePixelRatio || 1;

  // 根据设备的 DPR 设置画布的实际分辨率
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;

  const context = canvas.getContext('webgpu');
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format: presentationFormat,
  });

  const module = device.createShaderModule({
    label: 'buffer demo',
    code: `
      struct OutBufferStruct {
        color: array<vec4f, 3>,
        scale: vec2f,
        offset: vec2f,
      };
      struct OutVS {
        @builtin(position) position: vec4f,
        @location(0) color: vec4f
      };
      @group(0) @binding(0) var<uniform> outBufferStruct: OutBufferStruct;

      @vertex fn vs(
        @builtin(vertex_index) vertexIndex : u32
      ) -> OutVS {
        let pos = array(
          vec2f( 0.0,  0.5),  // top center
          vec2f(-0.5, -0.5),  // bottom left
          vec2f( 0.5, -0.5)   // bottom right
        );
        var outVS: OutVS;
        outVS.color = outBufferStruct.color[vertexIndex];
        outVS.position = vec4f(pos[vertexIndex] * outBufferStruct.scale + outBufferStruct.offset, 0.0, 1.0);

        return outVS;
      }
      
      @fragment fn fs(@location(0) color: vec4f) -> @location(0) vec4f {
        return color;
      }
    `,
  });

  const pipeline = device.createRenderPipeline({
    label: 'our hardcoded red triangle pipeline',
    layout: 'auto',
    vertex: {
      module,
      entryPoint: 'vs',
    },
    fragment: {
      module,
      entryPoint: 'fs',
      targets: [{ format: presentationFormat }],
    },
  });
  const rand = (min, max) => {
    if (min === undefined) {
      min = 0;
      max = 1;
    } else if (max === undefined) {
      max = min;
      min = 0;
    }
    return min + Math.random() * (max - min);
  };
  // 当前buffer需要的位数
  const uniformBufferSize = 12 * 4 + 2 * 4 + 2 * 4
  const kColorOffset = 0;
  const kScaleOffset = 12;
  const kOffsetOffset = 14;
  const objectNum = 1000;
  const objectList = []

  for (let i = 0; i < objectNum; i++) {
    // 创建buffer
    const uniformBuffer = device.createBuffer({
      label: 'our uniform buffer',
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    // 当前字节创建空间大小的类型化数组
    const uniformValues = new Float32Array(uniformBufferSize / 4);

    uniformValues.set([rand(), rand(), rand(), 1, rand(), rand(), rand(), 1, rand(), rand(), rand(), 1], kColorOffset);
    uniformValues.set([rand(-0.9, 0.9), rand(-0.9, 0.9)], kScaleOffset);
    uniformValues.set([rand(-0.9, 0.9), rand(-0.9, 0.9)], kOffsetOffset);

    // 绑定buffer
    const bindGroup = device.createBindGroup({
      label: 'triangle bind group',
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer } },
      ],
    });

    objectList.push({
      bindGroup,
      uniformValues,
      uniformBuffer
    })
  }

  const renderPassDescriptor = {
    label: 'our basic canvas renderPass',
    colorAttachments: [
      {
        clearValue: [0, 0, 0, 1],
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
  };

  function render() {
    renderPassDescriptor.colorAttachments[0].view =
      context.getCurrentTexture().createView();

    const encoder = device.createCommandEncoder({ label: 'our encoder' });

    const pass = encoder.beginRenderPass(renderPassDescriptor);

    pass.setPipeline(pipeline);
    for (let i = 0; i < objectList.length; i++) {
      const item = objectList[i]
      device.queue.writeBuffer(item.uniformBuffer, 0, item.uniformValues);
      pass.setBindGroup(0, item.bindGroup);
      pass.draw(3);
    }
    pass.end();

    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);
  }

  render();
}
main();
